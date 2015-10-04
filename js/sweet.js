var table = null;

var the_contexts = ["patient",
"pharmacist",
"primary physician",
"research: Cancer",
"research: Cardiac",
"research: Public Health"];

$(document).ready(function() {
    $("#viewer").html($("#permissionSelect").html());
    $(".view-select").slice(0,1).change(function() {
        table.ajax.reload();
    });
    table = $('#patientTable').DataTable( {
         "iDisplayLength": 50,
        "aaSorting": [],
        "fnDrawCallback": function( nRow, aData, iDataIndex ) {
                $("#patientTable .view-select").attr("multiple", "multiple");//.SumoSelect();
                $("#patientTable .view-select").SumoSelect();
                if (table === null) { return; }
                table.data().each(function(value, row, column) {
                    var j = row;
                    var acc = {};
                    row = value;
                    for (var i = 0; i < row.access.length; ++i) {
                        acc[row.access[i]] = true;
                    }
                    for (var i = 0; i < the_contexts.length; ++i) {
                        if (the_contexts[i] in acc) {
                            //for (var j = 0; j < $("#patientTable .view-select").length; ++j) {
                                $("#patientTable .view-select")[j].sumo.selectItem(i);
                            //}
                        }
                    }
                });
            //}
        },
        "ajax": "http://localhost:5000/get_patient",
        "columns": [
            { "data": "name" },
            { "render": function(data,type,row) { 
                var context = $(".view-select").slice(0,1).val();
                    var canAccess = false;
                    for (var i = 0; i < row.access.length; ++i) {
                        if (row.access[i] === context) {
                            canAccess = true;
                        }
                    }
                    if (!canAccess) {
                        //return "X";
                    }

                    var context = $(".view-select").slice(0,1).val();
                    var found = false;
                    var public_key = 0;

                    for (var i = 0; i < row.access.length; ++i) {
                        if (row.access[i] === context) {
                            found = true; 
                            public_key = row.keys[i];
                        }
                    }

                    if (!found) { return 'X'; }
                    if (found && row['encrypted']) {
                        try {
                            if (row['index'] == 0) {
                                //console.log(public_key);
                            }
                            var key = sjcl.decrypt(context, public_key);
                        } catch (err) {
                            //console.log(row['index']);
                            console.log("err");
                            return 'X';
                        }
                        var thetemp = row.value;
                        try {
                            row.value = sjcl.decrypt(key, row.value);
                        } catch (err) {
                            //row.value = thetemp;
                            return 'X';
                        }
                        row['tableEncrypted'] = false;
                    }
                    //show encrypted stuff only if it's the patient
                    if (row['tableEncrypted'] && context!=='patient') {
                        return 'X';
                    }

                    if (row.type === 'text') {
                        return row.value;
                    } else if (row.type === 'img') {
                        return '<img height="100" width="100" src="data:image/png;base64,' + 
                        row.value + '" alt="IMG"/>';
                    } else {
                        return "INVALID RECORD TYPE";
                    }
                }
            },
            { "render": function(data, type, row) {
                //$("#
                //Decrypt record
                //var t = $($("#permissionSelect").html());
                //t.SumoSelect();
                //return t.html();
                return $("#permissionSelect").html();
                }
            },
        ]
    } );
} );
/**
 * In accordance with the people's keys this will encrypt the data once and
 * return a list of len(people) keys, one for each user.  The key is unlocked
 * by their using their private key.
 * msg = decrypt(msg, decrypt(key, private))
 */
function encrypt(data, people) {
    //data: the data that is encrypted
    //people: array containing the public keys of n people
    //returns: 
    var keys = [];
    //NOT SECURE :P
    var msg_key = "0";
    for (var i = 0; i < people.length; ++i) {
        keys.push(sjcl.encrypt(people[i], msg_key));
    }
    return {"data": sjcl.encrypt(msg_key, data),
            "keys": keys};
}
function update() {
    var rec = {id: '000'};
    records = [];
    table.data().each(function(value, row, column) {
        row = value;
        //who can access the data
        var i = parseInt(row['index'])
        var accessors = $("#patientTable .view-select").slice(i, i+1).val();
        if (typeof(accessors) === 'string') {
            accessors = [accessors];
        }
        row['access'] = accessors;
        var temp = row['value'];

        //we need to rekey for the patient
        if (row['encrypted']) {
            try {
                                                //patient's key
                temp = sjcl.decrypt('patient', row.keys[0]);
                temp = sjcl.decrypt(temp, row['value']);
            } catch (err) {
                //console.log("could not decrypt patient data");
                temp = row['value'];
            }
        }

        var encrypted = encrypt(temp, accessors);
        var encryptedData = encrypted.data;
        var keys = encrypted.keys;
        row['keys'] = keys;
        row['value'] = encryptedData;
        row['encrypted'] = true;
        records.push(row);
    });
    rec['records'] = records;
    rec['encrypted'] = true;
    rec = JSON.stringify(rec);
    $.ajax({contentType: "application/json", url:
        "http://localhost:5000/access", type:"POST", data: rec, 
        success: function() {
            table.ajax.reload();
        }
    });
}
