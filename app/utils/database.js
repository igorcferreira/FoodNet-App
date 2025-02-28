import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("foodnet.db");

export async function createDatabaseTables() {
	return db.execAsync(`CREATE TABLE IF NOT EXISTS Records (
						file_uri TEXT NOT NULL PRIMARY KEY, 
						category TEXT NOT NULL, 
						ingredients TEXT NOT NULL, 
						calorie REAL NOT NULL, 
						carbs REAL NOT NULL, 
						protein REAL NOT NULL, 
						fat REAL NOT NULL,  
						time_created TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
					)`);
}

export async function dropTable() {
	return db.execAsync(`DROP TABLE Records`);
}

export async function insertRecords(record) {
	const statement = await db.prepareAsync(`INSERT INTO Records
					(file_uri,category,ingredients,calorie,carbs,protein,fat)
					VALUES ($file_uri,$category,$ingredients,$calorie,$carbs,$protein,$fat)`);
	try {
		return await statement.executeAsync({ 
			$file_uri: record.file_uri,
			$category: record.category,
			$ingredients: record.ingredients,
			$calorie: record.calorie,
			$carbs: record.carbs,
			$protein: record.protein,
			$fat: record.fat
		});
	} finally {
		await statement.finalizeAsync();
	}
}

export async function selectLastKRecords(k) {

	const statement = await db.prepareAsync(`
					SELECT file_uri,category,ingredients,calorie,carbs,protein,fat, date(time_created,'localtime') AS date, time(time_created,'localtime') AS time 
					FROM Records
					ORDER BY time_created DESC
					LIMIT $limit`);
	try {
		const result = await statement.executeAsync({ $limit: k });
		return await result.getAllAsync();
	} finally {
		await statement.finalizeAsync();
	}
}

export async function selectRecordsOnDate(date) {
	const statement = await db.prepareAsync(`
					SELECT file_uri,category,ingredients,calorie,carbs,protein,fat, date(time_created,'localtime') AS date, time(time_created,'localtime') AS time 
					FROM Records
					WHERE strftime('%s',date(time_created,'localtime')) = strftime('%s',$date)
					ORDER BY time_created ASC`);
	try {
		const result = await statement.executeAsync({ $date: date });
		const elements = await result.getAllAsync();
		return elements;
	} finally {
		await statement.finalizeAsync();
	}
}

export async function selectEarliestDate() {
	const statement = await db.prepareAsync(`
					SELECT date(time_created,'localtime') AS date
					FROM Records
					ORDER BY time_created ASC
					LIMIT 1`);
	try {
		const result = await statement.executeAsync({});
		const elements = result.getAllAsync();
		return elements;
	} finally {
		await statement.finalizeAsync();
	}
}

export async function selectNutrientsSumBetweenDates(startDate, endDate) {

	const statement = await db.prepareAsync(`
					SELECT sum(calorie) AS sum_calorie, sum(carbs) AS sum_carbs, sum(protein) AS sum_protein, 
					sum(fat) AS sum_fat, date(time_created,'localtime') AS date
					FROM Records 
					WHERE strftime('%s',date(time_created,'localtime')) 
					BETWEEN strftime('%s',$startDate) AND strftime('%s',$endDate)
					GROUP BY date(time_created,'localtime')
					ORDER BY date(time_created,'localtime') ASC
					`);
	try {
		const result = await statement.executeAsync({
			$startDate: startDate,
			$endDate: endDate
		});
		const elements = await result.getAllAsync();
		return elements;
	} finally {
		await statement.finalizeAsync();
	}
}

export async function selectNutrientsSumOnDate(date) {

	const statement = await db.prepareAsync(`
					SELECT sum(calorie) AS sum_calorie, sum(carbs) AS sum_carbs, sum(protein) AS sum_protein, sum(fat) AS sum_fat
					FROM Records 
					WHERE strftime('%s',date(time_created,'localtime')) = strftime('%s',$date)
					`);
	try {
		const result = await statement.executeAsync({ $date: date });
		const elements = await result.getAllAsync();
		return elements;
	} finally {
		await statement.finalizeAsync();
	}
}
