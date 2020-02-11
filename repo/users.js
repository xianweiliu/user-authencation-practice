// required a node module called fs, this is for the file system
const fs = require("fs");
const crypto = require("crypto");
class UsersRepo {
    constructor(filename) {
        // if the filename not exist then throw an error
        if (!filename) {
            throw new Error("Creating a repository requires a filename");
        }
        this.filename = filename;
        try {
            // check if the file exist if not
            fs.accessSync(this.filename);
        } catch (err) {
            // create a file with that name and width an empty array
            fs.writeFileSync(this.filename, "[]");
        }
    }
    async getAll() {
        // open the file called this.filename
        const contents = JSON.parse(
            await fs.promises.readFile(this.filename, {
                encoding: "utf8",
            }),
        );
        return contents;
    }
    // creating the new user and adding id with it
    async create(attrs) {
        attrs.id = this.randomId();
        const records = await this.getAll();
        records.push(attrs);
        // after its created and add the records back to the file
        // in this case call the write all function
        await this.writeAll(records);
        return attrs;
    }
    // writes records to the this.filename
    async writeAll(records) {
        //write the updated records array back to this.filename
        await fs.promises.writeFile(
            this.filename,
            JSON.stringify(records, null, 2),
        );
    }
    // generating ramdon ID by using crypto
    randomId() {
        return crypto.randomBytes(4).toString("hex");
    }

    // querying one of the user by id
    async getOne(id) {
        const records = await this.getAll();
        return records.find(record => record.id === id);
    }
    // deleting user by an id
    async delete(id) {
        const records = await this.getAll();
        const filterRec = records.filter(record => record.id !== id);
        // call writeall after its done
        await this.writeAll(filterRec);
    }
    // updating the existing user info with id and attribute that needed to update
    async update(id, attrs) {
        const records = await this.getAll();
        const record = records.find(record => record.id === id);
        // if id wasn't found throw an error
        if (!record) {
            throw new Error(`Record with id ${id} not found`);
        }
        // assginning the attris to the current record
        Object.assign(record, attrs);
        // call the writeall function again to complete update
        await this.writeAll(records);
    }

    // searching any of the attributes (such as id, email,or password) that passed in and iterate through the file and check if found record
    async getOneBy(filters) {
        const records = await this.getAll();
        // iterate the records file
        for (let record of records) {
            let found = true;
            // iterate the filters that passed in as an object -> that's why using for in
            for (let key in filters) {
                // check it the records key it match the filter keys
                if (record[key] !== filters[key]) {
                    found = false;
                }
            }
            // if found is still true than return record
            if (found) {
                return record;
            }
        }
    }
}

module.exports = new UsersRepo("users.json");
