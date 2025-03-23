const { parentPort, workerData } = require("worker_threads");
const csv = require("csv-parser");
const fs = require("fs");
const { dbConnect } = require("../config/database");

const User = require("../models/user.model");
const Agent = require("../models/agent.model");
const Account = require("../models/account.model");
const Carrier = require("../models/carrier.model");
const Category = require("../models/category.model");
const Policy = require("../models/policy.model");

dbConnect();

const validGenders = ["Male", "Female", "Other"];

// Reusable helper to process and map entities
const processEntities = async (model, fieldName, values) => {
  const map = {};
  const uniqueValues = [...new Set(values.filter(Boolean))];

  const existing = await model.find({ [fieldName]: { $in: uniqueValues } });
  existing.forEach((item) => (map[item[fieldName]] = item._id));

  const newValues = uniqueValues.filter((val) => !map[val]);
  const created = await model.insertMany(
    newValues.map((val) => ({ [fieldName]: val }))
  );
  created.forEach((item) => (map[item[fieldName]] = item._id));

  return map;
};

const processCSV = async (filePath) => {
  const rows = [];

  // Step 1: Read CSV file into memory
  await new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("error", reject)
      .on("end", resolve);
  });

  try {
    console.log(`Processing ${rows.length} rows...`);

    // Step 2: Extract unique values
    const agents = rows.map((row) => row.agent);
    const accounts = rows.map((row) => row.account_name?.trim().toLowerCase());
    const categories = rows.map((row) => row.category_name);
    const carriers = rows.map((row) => row.company_name);
    const policyNumbers = rows.map((row) => row.policy_number);

    const processedEmails = {};
    const uniqueEmailRows = rows.filter((row) => {
      if (processedEmails[row.email]) return false;
      processedEmails[row.email] = true;
      return true;
    });

    const uniqueEmails = uniqueEmailRows.map((row) => row.email);

    // Step 3: Process Entities (agents, accounts, categories, carriers)
    const agentMap = await processEntities(Agent, "agent", agents);
    const accountMap = await processEntities(Account, "account_name", accounts);
    const categoryMap = await processEntities(Category, "category_name", categories);
    const carrierMap = await processEntities(Carrier, "company_name", carriers);

    // Step 4: Process Users
    const existingUsers = await User.find({ email: { $in: uniqueEmails } });
    const userMap = {};
    existingUsers.forEach((user) => (userMap[user.email] = user._id));

    const newUsers = uniqueEmailRows
      .filter((row) => !userMap[row.email])
      .map((row) => ({
        firstname: row.firstname,
        dob: new Date(row.dob),
        address: row.address?.trim() || "NA",
        phone: row.phone,
        state: row.state?.trim() || "NA",
        zip: row.zip?.trim() || "NA",
        email: row.email,
        gender: validGenders.includes(row.gender) ? row.gender : "Male",
        userType: row.userType,
        agentId: agentMap[row.agent],
        accountId: accountMap[row.account_name?.trim().toLowerCase()],
      }));

    const insertedUsers = await User.insertMany(newUsers, { ordered: false });
    insertedUsers.forEach((user) => (userMap[user.email] = user._id));

    // Step 5: Process Policies
    const existingPolicies = await Policy.find({
      policy_number: { $in: [...new Set(policyNumbers)] },
    });
    const existingPolicyNumbers = new Set(
      existingPolicies.map((p) => p.policy_number)
    );

    const newPolicies = rows
      .filter((row) => {
        return (
          row.policy_number &&
          !existingPolicyNumbers.has(row.policy_number) &&
          userMap[row.email]
        );
      })
      .map((row) => ({
        policy_number: row.policy_number,
        policy_start_date: new Date(row.policy_start_date),
        policy_end_date: new Date(row.policy_end_date),
        categoryId: categoryMap[row.category_name],
        carrierId: carrierMap[row.company_name],
        userId: userMap[row.email],
      }));

    await Policy.insertMany(newPolicies, { ordered: false });

    parentPort.postMessage(
      `Upload Complete: Processed ${rows.length} rows, created ${newUsers.length} users and ${newPolicies.length} policies`
    );
  } catch (err) {
    console.error("Error processing CSV:", err);
    parentPort.postMessage("Upload Failed: " + err.message);
  } finally {
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });
  }
};

processCSV(workerData.filePath);
