'use strict';

var mysql = require('mysql');
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
    params = params.map((x) => this.connection.escape(x));
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
    var examples = {};
    examples['application/json'] = {
  "message" : "message"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
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
    let query_str = 'SELECT * FROM `leads` where project_id = ? and user_id = ?';
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
 * Creates a new issue
 *
 * body IssueResponse all the relevant details for creating a new issue
 * returns SuccessResponse
 **/
exports.createIssue = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "message" : "message"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
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
    var examples = {};
    examples['application/json'] = {
  "message" : "message"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
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
    var examples = {};
    examples['application/json'] = {
  "message" : "message"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
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
          console.log(results);
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
    let query_str = 'select * from `issues` where `issue_id` = ?';
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
//     var examples = {};
//     examples['application/json'] = [ {
//   "updated_time" : "updated_time",
//   "issue_id" : "issue_id",
//   "status" : "status"
// }, {
//   "updated_time" : "updated_time",
//   "issue_id" : "issue_id",
//   "status" : "status"
// } ];
//     if (Object.keys(examples).length > 0) {
//       resolve(examples[Object.keys(examples)[0]]);
//     } else {
//       resolve();
//     }
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
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "message" : "message"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
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
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ "", "" ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
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
    let query_str = 'SELECT name, description, created_date from `project` where project_id = ?'
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
 * Get all the assigned users for a particular issue
 *
 * issueid String gets all the users assigned to an issue
 * returns List
 **/
exports.getUserAssignedIssue = function(issueid) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "userid" : "userid"
}, {
  "userid" : "userid"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
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
    var examples = {};
    examples['application/json'] = {
  "message" : "message"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
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
    var examples = {};
    examples['application/json'] = {
  "message" : "message"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

