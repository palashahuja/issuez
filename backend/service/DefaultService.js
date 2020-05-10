'use strict';

var mysql = require('mysql');
// var bcrypt = require('bcryptjs');
require('dotenv').config();


class Connection {
  static connection;
  static initializeConnection(){
    if(!this.connection){
      return new Promise((resolve, reject) => {
        this.connection = mysql.createConnection({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.DB_NAME
        });
        this.connection.connect();
        resolve(this.connection);
      });
    }
  }
  static async query(inputStr, params, callback_fn){
    await this.initializeConnection();
    // sql injection prevention
    //params = params.map((x) => this.connection.escape(x));
    return this.connection.query(inputStr, params, callback_fn);
  }
}



/**
 * Assign a user to a particular issue
 *
 * issueid String the issueid to which the user needs to be assigned
 * userid String the relevant user id
 * returns SuccessResponse
 **/
exports.assignUserToIssue = function(issueid,userid) {
  return new Promise(function(resolve, reject) {
    let query_str = 'INSERT INTO `assigned`(`issue_id`,`user_id`,`assigned_date`) VALUES (?, ?, now())';
    let params = [issueid, userid];
    Connection.query(query_str, params, (error, results, fields) => {
      if(error){
        reject({'message': error})
      }
      else {
        resolve();
      }
    })
  });
}


/**
 * returns whether this particular user is a project lead or not
 *
 * projectid String the project id for which the lead needs to be checked
 * userid String the user id for which the lead needs to be checked
 * returns SuccessResponse
 **/
exports.checkUserProjectLead = function(projectid,userid) {
  return new Promise((resolve, reject) => {
    let query_str = 'SELECT * FROM `leads` WHERE project_id = ? AND user_id = ?';
    let params = [projectid, userid];
    Connection.query(query_str, params, (error, results, fields) => {
      if(error){
        reject({'message': error})
      }
      else {
        resolve({'message': results.length > 0});
      }
    })
  });
}

/**
 * returns all projects for which this user is a project lead
 *
 * userid String the user id for which the leads need to be checked
 * returns SuccessResponse
 **/
exports.getUserProjectLeads = function(userid) {
  return new Promise((resolve, reject) => {
    let query_str = 'SELECT * FROM `leads` WHERE user_id = ?';
    let params = [userid];
    Connection.query(query_str, params, (error, results, fields) => {
      if(error){
        reject({'message': error})
      }
      else {
        resolve(results);
      }
    })
  });
}


/**
 * Creates a new issue
 *
 * body IssueResponse all the relevant details for creating a new issue
 * returns SuccessResponse
 **/
exports.createIssue = function(body) {
  // console.log(body);
  return new Promise(function(resolve, reject) {
    let query_str = 'INSERT INTO `issues`(`title`,`description`,`created_date`, `reporter_id`, `project_id`) VALUES (?, ?, now(), ?, ?)';
    let params = [body.title, body.description, body.reporter_id, body.project_id];
    Connection.query(query_str, params, (error, results, fields) => {
      if(error){
        reject({'message': error})
      }
      else {
        // console.log(resultsinsertId);
        let issueID = results.insertId;
        query_str = "INSERT INTO `issue_history`(`issue_id`, `updated_time`, `status`,`project_id`) VALUES(?, now(), ?, ?)";
        params = [issueID,body.latest_status, body.project_id];
        Connection.query(query_str, params, (error) => {
          if(error){
            reject({'message': error})
          }
          else {
            resolve({'message': 'inserted successfully'});
          }
        })
      }
    })
  });
}


/**
 * creates a new project
 *
 * body FullProjectDetail the required details about creating a new project
 * returns SuccessResponse
 **/
exports.createNewProject = function(body) {
  return new Promise(function(resolve, reject) {
    let query_str = 'INSERT INTO `project`(`name`,`description`,`created_date`) VALUES (?, ?, now())';
    let params = [body.name, body.description];
    Connection.query(query_str, params, (error, results, fields) => {
      if(error){
        reject({'message': error})
      }
      else {
        let projID = results.insertId;
        let trans = body.status_edges;
        for (let i = 0; i < body.status_list.length; i++) {
          query_str = 'INSERT INTO `status_list`(`project_id`,`status_name`) VALUES (?, ?)';
          params = [projID, body.status_list[i]];
          Connection.query(query_str, params, (error, results, fields) => {
            if(error){
              reject({'message': error})
            }
          })
        }
        for (let i = 0; i < trans.length; i++) {
          query_str = 'INSERT INTO `transition`(`project_id`,`status_from`,`status_to`) VALUES (?, ?, ?)';
          params = [projID, trans[i][0], trans[i][1]];
          Connection.query(query_str, params, (error, results, fields) => {
            if(error){
              reject({'message': error});
            }
          })
        }
        query_str = 'INSERT INTO `leads`(`project_id`, `user_id`, `assigned_date`) VALUES(?, ?, now())';
        params = [projID, body.project_lead ]
        Connection.query(query_str, params, (error, results, fields) => {
          if(error){
            reject({'message': error});
          }
        })
        resolve({message: 'Inserted Successfully'});
      }
    })
  });
}


/**
 * creates the user a lead for the project
 *
 * projectid String the project id for which the lead needs to be checked
 * userid String the user id for which the lead needs to be checked
 * returns SuccessResponse
 **/
exports.createProjectLead = function(projectid,userid) {
  return new Promise(function(resolve, reject) {
    let query_str = 'INSERT INTO `leads`(`user_id`,`project_id`,`assigned_date`) VALUES (?, ?, now())';
    let params = [userid, projectid];
    Connection.query(query_str, params, (error, results, fields) => {
      if(error){
        reject({'message': error})
      }
      else {
        resolve();
      }
    })
  });
}


/**
 * Get all the issues for a particular user
 *
 * userid String gets the issues assigned to a user
 * returns List
 **/
exports.getIssueAssignedUser = function(userid) {
  return new Promise(function(resolve, reject) {
       let query_str = " WITH a AS \
       ( SELECT a.issue_id, max(c.updated_time) AS latest_time FROM  \
        `issue_tracker`.`issues` a LEFT JOIN `issue_tracker`.`assigned` b \
        ON a.issue_id = b.issue_id LEFT JOIN `issue_tracker`.`issue_history` c \
        ON a.issue_id = c.issue_id WHERE  b.user_id = ? GROUP BY  a.issue_id) \
        SELECT b.*, a.latest_time, c.status FROM a LEFT JOIN `issue_tracker`.`issues` b \
        ON a.issue_id = b.issue_id LEFT JOIN `issue_tracker`.`issue_history` c ON \
        a.issue_id = c.issue_id AND c.updated_time = a.latest_time";
      let params = [userid];
      Connection.query(query_str, params, (error, results, fields) => {
        if(error){
          reject({'message': error});
        }
        else {
          resolve(results);
        }
      })
  });
}


/**
 * Returns the information particular to an issue
 *
 * issueid String the relevant issue id
 * returns IssueResponse
 **/
exports.getIssueDetails = function(issueid) {
  return new Promise(function(resolve, reject) {
    let query_str = 'SELECT * FROM `issues` A NATURAL JOIN `issue_history` B WHERE A.issue_id = ? ORDER BY `updated_time` DESC LIMIT 1';
    let params = [issueid];
    Connection.query(query_str, params, (error, results, fields) => {
      if(error) {
        reject({'message': error})
      }
      else {
        resolve(results);
      }
    })
  });
}


/**
 * Get all the previous information related to an issue
 *
 * issueid String gets the issue history of the particular issue
 * returns List
 **/
exports.getIssueHistoryDetails = function(issueid) {
  return new Promise(function(resolve, reject) {
    let query_str = 'SELECT updated_time, issue_id, status FROM `issue_history` WHERE `issue_id` = ? ORDER BY updated_time DESC';
    let params = [issueid];
    Connection.query(query_str, params, (error, results, fields) => {
      if(error) {
        reject({'message': error})
      }
      else {
        resolve(results);
      }
    })
  });
}

/**
 * returns the issues which are not assigned to any particular user for a given status
 *
 * projectid String the project id for which the lead needs to be checked
 * status String depending on the status is \"assigned\" or \"unassigned\", one can list out the issues
 * returns SuccessResponse
 **/
exports.getIssuesByStatus = function(projectid,status) {
  return new Promise((resolve, reject) => {
    let query_str = 'SELECT issue_id FROM `issues` WHERE project_id = ? AND CASE WHEN ? = \"unassigned\" THEN issue_id NOT IN (SELECT issue_id from assigned) ELSE issue_id IN (SELECT issue_id from assigned) END';
    let params = [projectid, status];
    Connection.query(query_str, params, (error, results, fields) => {
      if(error){
        reject({'message': error})
      }
      else {
        resolve(results);
      }
    })
  });
}


/**
 * returns the next possible status of a project depending on the current status
 *
 * projectid String the project id for which the lead needs to be checked
 * status String depending on the status is \"assigned\" or \"unassigned\", one can list out the issues
 * returns List
 **/
exports.getNextPossibleStatus = function(projectid,status) {
  return new Promise((resolve, reject) => {
    let query_str = 'SELECT status_to FROM `transition` WHERE project_id = ? AND status_from = ?';
    let params = [projectid, status];
    Connection.query(query_str, params, (error, results, fields) => {
      if(error){
        reject({'message': error})
      }
      else {
        resolve(results);
      }
    })
  });
}


/**
 * gets all the relevant details for the project
 *
 * projectid String the project id for which the details need to be listed
 * returns List
 **/
exports.getProjectDetails = function(projectid) {
  return new Promise(function(resolve, reject) {
    let query_str = 'SELECT name, description, created_date FROM `project` WHERE project_id = ?';
    let params = [projectid]
    Connection.query(query_str, params, (error, results, fields) => {
      if(error){
        reject({'message': error});
      }
      else {
        resolve(results);
      }
    })
  });
}

/**
 * gets all the projects
 *
 * returns List
 **/
exports.getAllProjects = function() {
  return new Promise(function(resolve, reject) {
    let query_str = 'SELECT * FROM `project`';
    Connection.query(query_str, (error, results, fields) => {
      if(error){
        reject({'message': error});
      }
      else {
        resolve(results);
      }
    })
  });
}

/**
 * gets all the users
 *
 * returns List
 **/
exports.getAllUsers = function() {
  return new Promise(function(resolve, reject) {
    let query_str = 'SELECT user_id, username FROM `users`';
    Connection.query(query_str, (error, results, fields) => {
      if(error){
        reject({'message': error});
      }
      else {
        resolve(results);
      }
    })
  });
}

/**
 * creates a new user
 *
 * body FullUserDetail the required details about creating a new user
 * returns SuccessResponse
 **/
exports.createNewUser = function(body) {
  return new Promise(function(resolve, reject) {
    let query_str = 'INSERT INTO `users`(`email_address`,`username`,`displayname`,`password`) VALUES (?, ?, ?, ?)';

    let params = [body.email_address, body.username, body.displayname, body.password];
    Connection.query(query_str, params, (error, results, fields) => {
      if(error){
        reject({'message': error})
      }
      else {
        resolve({userid: results.insertId});
      }
    })
  });
}

/**
 * verfies a  user
 *
 * body PartUserDetail the required details about verifying a user
 * returns SuccessResponse
 **/
exports.verifyUser = function(body) {
  return new Promise(function(resolve, reject) {
    let query_str = 'SELECT * FROM `users` WHERE email_address = ? AND password = ?';
    let params = [body.email_address, body.password];
    Connection.query(query_str, params, (error, results, fields) => {
      if(error){
        reject({'error': error})
      }
      else {
        resolve({'message': results});
      }
    })
  });
}

/**
 * Get all the assigned users for a particular issue
 *
 * issueid String gets all the users assigned to an issue
 * returns List
 **/
exports.getUserAssignedIssue = function(issueid) {
  return new Promise(function(resolve, reject) {
    let query_str = 'SELECT user_id FROM `assigned` WHERE `issue_id` = ?';
    let params = [issueid];
    Connection.query(query_str, params, (error, results, fields) => {
      if(error) {
        reject({'message': error})
      }
      else {
        resolve(results);
      }
    })
  });
}


/**
 * Partially updates the issue
 *
 * body IssueDetail the information regarding issue details (optional)
 * issueid String the relevant issue id
 * returns SuccessResponse
 **/
exports.updateIssueDetails = function(body,issueid) {
  return new Promise(function(resolve, reject) {
    let query_str = 'UPDATE `issues` SET `title` = ?,`description` = ? WHERE issue_id = ?';
    let params = [body.title, body.description, issueid];
    Connection.query(query_str, params, (error, results, fields) => {
      if(error){
        reject({'message': error})
      }
      else {
        // resolve({'message': 'updated successfully'});
        // console.log(resultsinsertId);
        let issueID = issueid;
        query_str = "INSERT INTO `issue_history`(`issue_id`, `updated_time`, `status`,`project_id`) VALUES(?, now(), ?, ?)";
        params = [issueID, body.status, body.project_id];
        Connection.query(query_str, params, (error, results, fields) => {
          if(error){
            reject({'message': error})
          }
          else {
            console.log(results);
            resolve({'message': 'inserted successfully'});
          }
        })

      }
    })
  });
}


/**
 * updates the details for the particular project
 *
 * body ProjectInputDetail  (optional)
 * projectid String the project id for which the details need to be listed
 * returns SuccessResponse
 **/
exports.updateProjectDetails = function(body,projectid) {
  return new Promise(function(resolve, reject) {
    let query_str = 'UPDATE `project` SET `name` = ?,`description` = ? WHERE project_id = ?';
    let params = [body.name, body.description, projectid];
    Connection.query(query_str, params, (error, results, fields) => {
      if(error){
        reject({'message': error})
      }
      else {
        resolve();
      }
    })
  });
}
