var token = '90934388|-31949226728747057|90957190';
var dbname = 'SCHOOL-db';
var relation = "STUDENT-table";
var baseUrl = "http://api.login2explore.com:5577";

function resetForm() {
    $("#studentRoll").val('');
    $("#studentName").val('');
    $("#studentClass").val('');
    $("#studentDob").val('');
    $("#studentAddr").val('');
    $("#studentDoe").val('');
}

function disableAll() {
    resetForm();
    $("#studentRoll").prop("disabled", false);
    $("#studentRoll").focus();
    $("#studentName").prop("disabled", true);
    $("#studentClass").prop("disabled", true);
    $("#studentDob").prop("disabled", true);
    $("#studentAddr").prop("disabled", true);
    $("#studentDoe").prop("disabled", true);
    $("#saveStudent").prop("disabled", true);
    $("#updateStudent").prop("disabled", true);
    $("#resetStudent").prop("disabled", true);
}

disableAll();

function executeCommand(reqString, apiEndPointUrl) {
    var url = baseUrl + apiEndPointUrl;
    var jsonObj;
    
    $.post(url, reqString, function (result) {
        jsonObj = JSON.parse(result);
    }).fail(function (result) {
        var dataJsonObj = result.responseText;
        jsonObj = JSON.parse(dataJsonObj);
    });
    return jsonObj;
}

function createGET_BY_KEYRequest(token, dbname, relationName, jsonObjStr, createTime, updateTime) {
    if (createTime !== undefined) {
        if (createTime !== true) {
            createTime = false;
        }
    } else {
        createTime = false;
    }
    if (updateTime !== undefined) {
        if (updateTime !== true) {
            updateTime = false;
        }
    } else {
        updateTime = false;
    }
    var value1 = "{\n"
            + "\"token\" : \""
            + token
            + "\",\n" + "\"cmd\" : \"GET_BY_KEY\",\n"
            + "\"dbName\": \""
            + dbname
            + "\",\n"
            + "\"rel\" : \""
            + relationName
            + "\",\n"
            + "\"jsonStr\":\n"
            + jsonObjStr
            + "\,"
            + "\"createTime\":"
            + createTime
            + "\,"
            + "\"updateTime\":"
            + updateTime
            + "\n"
            + "}";
    return value1;
}

function findRoll(ele) {
    var roll = ele.value;
    var obj = {
        Roll_No: roll
    };
    var jsnobj = JSON.stringify(obj);
    var request = createGET_BY_KEYRequest(token, dbname, relation, jsnobj);
    jQuery.ajaxSetup({ async: false });
    var res = executeCommand(request, "/api/irl");
    jQuery.ajaxSetup({ async: true });
    if (res.status == 400) {
        $("#studentName").prop("disabled", false);
        $("#studentName").focus();
        $("#studentClass").prop("disabled", false);
        $("#studentDob").prop("disabled", false);
        $("#studentAddr").prop("disabled", false);
        $("#studentDoe").prop("disabled", false);
        $("#saveStudent").prop("disabled", false);
        $("#resetStudent").prop("disabled", false);
    } else {
        $("#studentName").prop("disabled", false);
        $("#studentRoll").prop("disabled", true);
        $("#studentClass").prop("disabled", false);
        $("#studentDob").prop("disabled", false);
        $("#studentAddr").prop("disabled", false);
        $("#studentDoe").prop("disabled", false);
        $("#resetStudent").prop("disabled", false);
        $("#saveStudent").prop("disabled", true);
        $("#updateStudent").prop("disabled", false);
        var data = JSON.parse(res.data).record;
        $("#studentName").val(data.Full_Name);
        $("#studentClass").val(data.Class);
        $("#studentDob").val(data.Birth_Date);
        $("#studentAddr").val(data.Address);
        $("#studentDoe").val(data.Enrollment_Date);
    }
}

function createPUTRequest(connToken, jsonObj, dbName, relName) {
    var putRequest = "{\n"
            + "\"token\" : \""
            + connToken
            + "\","
            + "\"dbName\": \""
            + dbName
            + "\",\n" + "\"cmd\" : \"PUT\",\n"
            + "\"rel\" : \""
            + relName + "\","
            + "\"jsonStr\": \n"
            + jsonObj
            + "\n"
            + "}";
    return putRequest;
}

function saveData() {
    $("#ajax").html("wait");
    var roll = $("#studentRoll").val();
    var name = $("#studentName").val();
    var cls = $("#studentClass").val();
    var dob = $("#studentDob").val();
    var addr = $("#studentAddr").val();
    var doe = $("#studentDoe").val();

    if(roll == '') {
        alert("Roll Number is required!");
        $("#studentRoll").focus();
        return;
    }
    if(name == '') {
        alert("Full Name is required!");
        $("#studentName").focus();
        return;
    }
    if(cls == '') {
        alert("Class is required!");
        $("#studentClass").focus();
        return;
    }
    if(dob == '') {
        alert("Birth Date is required!");
        $("#studentDob").focus();
        return;
    }
    if(addr == '') {
        alert("Address is required!");
        $("#studentAddr").focus();
        return;
    }
    if(doe == '') {
        alert("Enrollment Date is required!");
        $("#studentDoe").focus();
        return;
    }

    var obj = {
        Roll_No: roll,
        Full_Name: name,
        Class: cls,
        Birth_Date: dob,
        Address: addr,
        Enrollment_Date: doe
    };
    var jsonobj = JSON.stringify(obj);
    var req = createPUTRequest(token, jsonobj, dbname, relation);
    jQuery.ajaxSetup({ async: false });
    var res = executeCommand(req, "/api/iml");
    jQuery.ajaxSetup({ async: true });

    alert("Data inserted successfully!");
    disableAll();
}

function createSETRequest(token, jsonStr, dbName, relName, type, primaryKey, uniqueKeys, foreignKeys) {
    if (type === undefined) {
        type = "DEFAULT";
    }
    var req = {
        token: token,
        cmd: "SET",
        dbName: dbName,
        rel: relName,
        type: type,
        jsonStr: JSON.parse(jsonStr)
    };
    if (primaryKey !== undefined) {
        req.primaryKey = primaryKey;
    }
    if (uniqueKeys !== undefined) {
        req.uniqueKeys = uniqueKeys;
    }
    if (foreignKeys !== undefined) {
        req.foreignKeys = foreignKeys;
    }
    req = JSON.stringify(req);
    return req;
}

function updateData() {
    var roll = $("#studentRoll").val();
    var name = $("#studentName").val();
    var cls = $("#studentClass").val();
    var dob = $("#studentDob").val();
    var addr = $("#studentAddr").val();
    var doe = $("#studentDoe").val();

    if(name == '') {
        alert("Full Name is required!");
        $("#studentName").focus();
        return;
    }
    if(cls == '') {
        alert("Class is required!");
        $("#studentClass").focus();
        return;
    }
    if(dob == '') {
        alert("Birth Date is required!");
        $("#studentDob").focus();
        return;
    }
    if(addr == '') {
        alert("Address is required!");
        $("#studentAddr").focus();
        return;
    }
    if(doe == '') {
        alert("Enrollment Date is required!");
        $("#studentDoe").focus();
        return;
    }

    var obj = {
        Roll_No: roll,
        Full_Name: name,
        Class: cls,
        Birth_Date: dob,
        Address: addr,
        Enrollment_Date: doe
    };
    var jsonobj = JSON.stringify(obj);
    var req = createPUTRequest(token, jsonobj, dbname, relation);
    jQuery.ajaxSetup({ async: false });
    var res = executeCommand(req, "/api/iml");
    jQuery.ajaxSetup({ async: true });

    alert("Data updated successfully!");
    disableAll();
}
