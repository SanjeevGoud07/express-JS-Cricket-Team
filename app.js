// const express = require("express");
// const app = express();
// const path = require("path");
// const { open } = require("sqlite");
// const sqlite3 = require("sqlite3");
// app.use(express.json());
// const dbPath = path.join(__dirname, "cricketTeam.db");
// let db = null;
// const initializeDb = async () => {
//   try {
//     db = await open({
//       filename: dbPath,
//       driver: sqlite3.Database,
//     });
//     app.listen(3000, () => {
//       console.log("Server Running At http://localhost:3000/");
//     });
//   } catch (e) {
//     console.log(`DB Error: ${e.message}`);
//     process.exit(1);
//   }
// };
// initializeDb();
// app.get("/", (request, response) => {
//   response.send("Hello This Is Sanjeev!");
// });

// //Convert to Response
// const convertToResponse = (Object) => {
//   return {
//     playerId: Object.player_id,
//     playerName: Object.player_name,
//     jerseyNumber: Object.jersey_number,
//     role: Object.role,
//   };
// };

// //Get All Players List
// app.get("/players/", async (request, response) => {
//   const playersQuery = `SELECT * FROM cricket_team;`;
//   const playersList = await db.all(playersQuery);
//   response.send(playersList.map((eachPlayer) => convertToResponse(eachPlayer)));
// });

// //Get By PlayerId
// app.get("/players/:playerId/", async (request, response) => {
//   const { playerId } = request.params;
//   const playerQuery = `SELECT * FROM cricket_team WHERE player_id = ${playerId};`;
//   const playerDet = await db.get(playerQuery);
//   response.send(convertToResponse(playerDet));
// });

// //Post Player
// app.post("/players/", async (request, response) => {
//   const { playerName, jerseyNumber, role } = request.body;
//   const PlayerPost = `INSERT INTO cricket_team
//   (player_name, jersey_number, role) VALUES ('${playerName}', ${jerseyNumber}, '${role}');`;
//   const dbResponse = await db.run(PlayerPost);
//   const player_id = dbResponse.lastID;
//   response.send("Player Added to Team");
//   response.send({ playerId: playerId });
// });

// //Update Player
// app.put("/players/:playerId/", async (request, response) => {
//   const { playerName, jerseyNumber, role } = request.body;
//   const { playerId } = request.params;
//   const UpdatePlayer = `UPDATE cricket_team SET player_name='${playerName}',jersey_number=${jerseyNumber},role='${role}' WHERE player_id=${playerId};`;
//   await db.run(UpdatePlayer);
//   response.send("Player Details Updated");
// });

// //Delete Player
// app.delete("/players/:playerId/", async (request, response) => {
//   const { playerId } = request.params;
//   const DeletePlayer = `DELETE FROM cricket_team WHERE player_id = ${playerID};`;
//   await db.run(DeletePlayer);
//   response.send("Player Removed");
// });

// module.exports = app;

const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "cricketTeam.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT
      *
    FROM
      cricket_team;`;
  const playersArray = await database.all(getPlayersQuery);
  response.send(
    playersArray.map((eachPlayer) =>
      convertDbObjectToResponseObject(eachPlayer)
    )
  );
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
    SELECT 
      * 
    FROM 
      cricket_team 
    WHERE 
      player_id = ${playerId};`;
  const player = await database.get(getPlayerQuery);
  response.send(convertDbObjectToResponseObject(player));
});

app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const postPlayerQuery = `
  INSERT INTO
    cricket_team (player_name, jersey_number, role)
  VALUES
    ('${playerName}', ${jerseyNumber}, '${role}');`;
  const player = await database.run(postPlayerQuery);
  response.send("Player Added to Team");
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const { playerId } = request.params;
  const updatePlayerQuery = `
  UPDATE
    cricket_team
  SET
    player_name = '${playerName}',
    jersey_number = ${jerseyNumber},
    role = '${role}'
  WHERE
    player_id = ${playerId};`;

  await database.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
  DELETE FROM
    cricket_team
  WHERE
    player_id = ${playerId};`;
  await database.run(deletePlayerQuery);
  response.send("Player Removed");
});
module.exports = app;
