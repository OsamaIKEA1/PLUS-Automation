const oracledb = require("oracledb");

class DatabaseHelper {
  static async getConnection() {
    try {
      return await oracledb.getConnection({
        user: "PLUS_READONLY",
        password: "PLUS_READONLY123",
        connectString: `(DESCRIPTION=
                          (ADDRESS=(PROTOCOL=TCP)(HOST=PPCRS581.ikeadt.com)(PORT=1521))
                          (CONNECT_DATA=(SERVICE_NAME=PLUSPPE.IKEADT.COM))
                        )`,
      });
    } catch (err) {
      console.error("Error connecting to the database:", err);
      throw err;
    }
  }

  static async executeQuery(connection, query, params = {}) {
    try {
      return await connection.execute(query, params);
    } catch (err) {
      console.error("Error executing query:", err);
      throw err;
    }
  }

  static async closeConnection(connection) {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing the connection:", err);
      }
    }
  }
}

class FetchData {
  constructor() {
    this.baseQuery = `
      SELECT REQUESTEDIMPLEMENTATIONDATE, TASKRECEIVEDDATE, UPDATEDOBJECTNAME,
            UPDATEDOBJECTNUMBER, IMPLEMENTATIONREQSUPPLIERID, UPDATEDOBJECTVERSION,
            UPDATEDOBJECTTYPE, ARTICLENAME, ARTICLENUMBER, ITEMTYPE,
            TASKRECEIVEDDATE, PLANNEDIMPLEMENTATIONDATE, CONNECTEDEXCEPTIONS,
            MESSAGETOSUPPLIER, IRNUMBER, BASEPRODUCTOID, PACKAGINGPARTOID, 
            EFFCONTEXTOID
      FROM PDMLINK.SUPPLIER_TASK_DETAILS_CACHE
      WHERE TASKOWNER=LOWER(:taskOwner) 
        AND TASKNAME=:taskName 
        AND TASKVIEW=:taskView 
        AND TASKSTATUS=:taskStatus 
        AND ISUNDERGOINGCHANGES=:isUndergoingChanges`;
  }

  async fetchAllData() {
    let connection;
    try {
      connection = await DatabaseHelper.getConnection();
      console.log("Connected to the database successfully!");

      // Define all parameter sets
      const paramSets = {
        purchasingEnv: {
          taskOwner: "plustest41",
          taskName: "Send Request for Implementation",
          taskView: "ITEM",
          taskStatus: "OPEN",
          isUndergoingChanges: 0
        },
        supplierEnv: {
          taskOwner: "plustest21",
          taskName: "Review Implementation Request",
          taskView: "ITEM",
          taskStatus: "OPEN",
          isUndergoingChanges: 0,
          cancellationRequested: 0
        }
      };

      // Execute queries in parallel
      const [purchasingResults, supplierResults] = await Promise.all([
        DatabaseHelper.executeQuery(
          connection, 
          this.baseQuery + " ORDER BY IRNUMBER", 
          paramSets.purchasingEnv
        ),
        DatabaseHelper.executeQuery(
          connection, 
          this.baseQuery + " AND CANCELLATIONREQUESTED=:cancellationRequested ORDER BY IRNUMBER", 
          paramSets.supplierEnv
        )
      ]);

      // Process results
      return {
        purchasing: {
          irDetails: this.processIrDetails(purchasingResults.rows),
          productStructures: this.processProductStructures(purchasingResults.rows)
        },
        supplier: {
          irDetails: this.processIrDetails(supplierResults.rows),
          productStructures: this.processProductStructures(supplierResults.rows)
        }
      };

    } catch (err) {
      console.error("Error fetching data:", err);
      throw err;
    } finally {
      await DatabaseHelper.closeConnection(connection);
    }
  }

  processIrDetails(rows) {
    const map = new Map();
    rows.forEach(row => {
      map.set(row[14], [
        row[4].match(/\((\d+)\)/)[1], // Supplier ID
        row[14], // IRNUMBER
        row[7],  // ARTICLENAME
        row[8],  // ARTICLENUMBER
        row[9],  // ITEMTYPE
        row[1],  // TASKRECEIVEDDATE
        row[0],  // REQUESTEDIMPLEMENTATIONDATE
        row[11], // DATEPLANNEDIMPLEMENTATIONDATE
        row[12], // CONNECTEDEXCEPTIONS
        row[13], // MESSAGETOSUPPLIER
      ]);
    });
    return map;
  }

  processProductStructures(rows) {
    const map = new Map();
    rows.forEach(row => {
      map.set(row[14], [
        row[14], // IRNUMBER
        row[0],  // REQUESTEDIMPLEMENTATIONDATE
        row[15], // BASEPRODUCTOID
        row[16], // PACKAGINGPARTOID
        row[17], // EFFCONTEXTOID
        row[4].match(/\((\d+)\)/)[1], // Supplier ID
      ]);
    });
    return map;
  }
}

module.exports = FetchData;