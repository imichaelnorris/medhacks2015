var table;
$(document).ready(function() {
    $("#viewer").html($("#permissionSelect").html());
    $(".view-select").slice(0,1).change(function() {
        console.log("reload");
        table.ajax.reload();
    });
    table = $('#patientTable').DataTable( {
         "iDisplayLength": 50,
        "aaSorting": [],
        "fnDrawCallback": function( nRow, aData, iDataIndex ) {
            // Bold the grade for all 'A' grade browsers
            //if ( aData[4] == "A" )
            //{
                //$('td:eq(4)', nRow).html( '<b>A</b>' );
                $("#patientTable .view-select").attr("multiple", "multiple");//.SumoSelect();
                $("#patientTable .view-select").SumoSelect();
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
                    console.log('hi');

                    for (var i = 0; i < row.access.length; ++i) {
                        if (row.access[i] === context) {
                            found = true; 
                            public_key = row.keys[i];
                        }
                    }
                    console.log(row.keys);

                    if (found && public_key != 0 && !('decrypted' in row)) {
                        console.log(public_key);
                        var key = sjcl.decrypt(context, public_key);
                        console.log(row.name);
                        console.log('key ' + key+" "+row.value);
                        row.value = sjcl.decrypt(key, row.value);
                        row['decrypted'] = true;
                    }
                    //show encrypted stuff only if it's the patient
                    if (!('decrypted' in row) && context!=='patient') {
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
    var i = 1;
    var rec = {id: '000'};
    records = [];
    table.data().each(function(value, row, column) {
        row = value;
        //who can access the data
        var accessors = $(".view-select").slice(i, i+1).val();
        row['access'] = accessors;
        console.log(row['access']);
        var temp = row['value'];
        if ('encrypted' in row) {
            temp = sjcl.decrypt('patient', temp);
        }

        var encrypted = encrypt(temp, accessors);
        var encryptedData = encrypted.data;
        //console.log(encryptedData);
        var keys = encrypted.keys;
        row['keys'] = keys;
        console.log(row['keys']);
        row['value'] = encryptedData;
        i += 1;
        records.push(row);
    });
    //console.log(records[0].value);
    rec['records'] = records;
    rec['encrypted'] = true;
    rec = JSON.stringify(rec);
    $.ajax({contentType: "application/json", url: "http://localhost:5000/access", type:"POST", data: rec});
    //console.log(rec);
}
