'use strict';

var utils = require('../utils/writer.js');
var Default = require('../service/DefaultService');

module.exports.assignUserToIssue = function assignUserToIssue (req, res, next, issueid, userid) {
  Default.assignUserToIssue(issueid, userid)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.checkUserProjectLead = function checkUserProjectLead (req, res, next, projectid, userid) {
  Default.checkUserProjectLead(projectid, userid)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.createIssue = function createIssue (req, res, next, body) {
  Default.createIssue(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.createNewProject = function createNewProject (req, res, next, body) {
  Default.createNewProject(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.createProjectLead = function createProjectLead (req, res, next, projectid, userid) {
  Default.createProjectLead(projectid, userid)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getIssueAssignedUser = function getIssueAssignedUser (req, res, next, userid) {
  Default.getIssueAssignedUser(userid)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getIssueDetails = function getIssueDetails (req, res, next, issueid) {
  Default.getIssueDetails(issueid)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getIssueHistoryDetails = function getIssueHistoryDetails (req, res, next, issueid) {
  Default.getIssueHistoryDetails(issueid)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getIssuesByStatus = function getIssuesByStatus (req, res, next, projectid, status) {
  Default.getIssuesByStatus(projectid, status)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getNextPossibleStatus = function getNextPossibleStatus (req, res, next, projectid, status) {
  Default.getNextPossibleStatus(projectid, status)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getProjectDetails = function getProjectDetails (req, res, next, projectid) {
  Default.getProjectDetails(projectid)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getUserAssignedIssue = function getUserAssignedIssue (req, res, next, issueid) {
  Default.getUserAssignedIssue(issueid)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateIssueDetails = function updateIssueDetails (req, res, next, body, issueid) {
  Default.updateIssueDetails(body, issueid)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateProjectDetails = function updateProjectDetails (req, res, next, body, projectid) {
  Default.updateProjectDetails(body, projectid)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
