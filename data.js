var carTypeChart = dc.rowChart("#carType"),
    gateNameChart = dc.rowChart("#gateName"),
    visCount = dc.dataCount(".dc-data-count"),
    visTable = dc.dataTable(".dc-data-table");

var firebaseRef = firebase.database().ref();
firebaseRef.child("Text").set("Algún valor");

d3.csv("Lekagul Sensor Data.csv", function(err, data) {
    if (err) throw err;

    //Convertir datos de fecha
    data.forEach(function(d) {
        d.Timestamp = new Date(d.Timestamp);
    });

    var ndx = crossfilter(data);
    var all = ndx.groupAll();

    var carTypeDim = ndx.dimension(function(d) { return d["car-type"]; });
    var gateNameDim = ndx.dimension(function(d) { return d["gate-name"]; });
    var dateDim = ndx.dimension(function(d) { return d.Timestamp; });


    var carTypeGroup = carTypeDim.group();
    var gateNameGroup = gateNameDim.group();
    var dateGroup = dateDim.group();

    carTypeChart
        .dimension(carTypeDim)
        .group(carTypeGroup)
        .elasticX(true);

    gateNameChart
        .dimension(gateNameDim)
        .group(gateNameGroup)
        .data(function(group) { return group.top(10); });

    visCount
        .dimension(ndx)
        .group(all);

    visTable
        .dimension(dateDim)
        .group(function(d) {
            var format = d3.format('02d');
            return d.Timestamp.getFullYear() + '/' + format((d.Timestamp.getMonth() + 1));
        })
        .columns([
            "Timestamp",
            "car-id",
            "car-type",
            "gate-name"

        ]);

    dc.renderAll();
});