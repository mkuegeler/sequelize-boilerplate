// Project run script
const { exec } = require("child_process");
const path = require('path');
const fs = require('fs');
const setup = require("./setup.json");


// Get arguments from command line
let initArgs = process.argv.slice(2);

switch (initArgs[0]) {
    case 'create': // Create models. See  src/db/schemas/schema.json
        let file = "";
        initArgs[1] ? file = initArgs[1] : file = setup.default_schema;
        createModels(file);
        break;
    case 'up': // Create tables from models in database
        migrations_up();
        break;
    case 'undo': // Revert most recent migration
        migrations_undo();
        break;
    case 'all':  // Revert back to initial state
        migrations_all();
        break;
    case 'to': // Revert back to a specific migration
        migrations_to(initArgs[1]);
        break;
    case 'seed': // This command will create a seed file in seeders
        let model = "model";
        if (initArgs[1]) { model = initArgs[1]; }
        seed(model);
        break;
    case 'seedall': // Committ seed to database.
        seed_all();
        break;
    case 'seedundo': // Revert most recent seed
        seed_undo();
        break;
    case 'seedundoall':  // Revert back all seeds
        seed_undoall();
        break;
    default:
        help();
}

// Argument functions
function help() {
    console.log("Run this script with one of these arguments: 'create', 'up', 'undo', 'all', 'to name-of-migration.js'");
}

function migrations_up() {
    execute("npx sequelize-cli db:migrate");
}

function migrations_undo() {
    execute("npx sequelize-cli db:migrate:undo");
}

function migrations_all() {
    execute("npx sequelize-cli db:migrate:undo:all");
}

function migrations_to(to) {
    execute(`npx sequelize-cli db:migrate:undo:all --to ${to}`);
}

function seed(model) {
    execute(`npx sequelize-cli seed:generate --name demo-${model}`);
}

function seed_all() {
    execute(`npx sequelize-cli db:seed:all`);
}

function seed_undo() {
    execute(`npx sequelize-cli db:seed:undo`);
}

function seed_undoall() {
    execute(`npx sequelize-cli db:seed:undo:all`);
}

function createModelCommand(model, force = false) {

    let result = "npx sequelize-cli model:generate --name ";

    for (const [key, value] of Object.entries(model)) {

        if (key === "name") { result += `${value} --attributes `; }
        if (key === "attributes") {

            for (const [attr_key, attr_value] of Object.entries(value)) {
                result += `${attr_key}:${attr_value},`
            }
        }
    }
    // Remove last comma and check if force (overwriting existing models) is true
    result = force === true ? `${result.replace(/,\s*$/, "")} --force` : result.replace(/,\s*$/, "");
    return result;


}

function createModels(schemaFile) {

    let location = path.resolve(setup.db_path, setup.schema_dir);

    fs.readFile(`${location}/${schemaFile}.json`, (err, data) => {
        if (err) throw err;
        let schema = JSON.parse(data);
        schema.forEach(model => {
            execute(createModelCommand(model, setup.overwrite));
        });
    });

}

function execute(command) {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}