import SQLiteESMFactory from 'wa-sqlite/dist/wa-sqlite-async.mjs'
// import {OriginPrivateFileSystemVFS as MyVFS} from 'wa-sqlite/src/examples/OriginPrivateFileSystemVFS.js'
import * as SQLite from 'wa-sqlite'

export async function hello() {
	const module = await SQLiteESMFactory()
	const sqlite3 = SQLite.Factory(module)
	const db = await sqlite3.open_v2('myDB')
	await sqlite3.exec(db, `SELECT 'Hello, world!'`, (row, columns) => {
		console.log(row, columns)
	})
	await sqlite3.close(db)
}

/**  Main function to set up and use SQLite */
export async function setupSQLite(databasePath = ':memory') {
	try {
		// Initialize SQLite module
		const module = await SQLiteESMFactory()
		const sqlite3 = SQLite.Factory(module)

		// Register a custom file system
		// const vfs = await MyVFS.create('myVFS', module)
		// sqlite3.vfs_register(vfs, true)

		const db = await sqlite3.open_v2(databasePath)

		// Create a table
		await sqlite3.exec(
			db,
			`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT
      )
    `,
		)

		// Insert some data
		await sqlite3.exec(
			db,
			`
      INSERT INTO users (name, email) VALUES
      ('Alice', 'alice@example.com'),
      ('Bob', 'bob@example.com')
    `,
		)

		// Query the data
		console.log('Users in the database:')
		await sqlite3.exec(db, `SELECT * FROM users`, (row, columns) => {
			console.log(row, columns)
		})

		// Close the database
		await sqlite3.close(db)

		console.log('SQLite operations completed successfully')
	} catch (error) {
		console.error('Error in SQLite setup:', error)
	}
}
