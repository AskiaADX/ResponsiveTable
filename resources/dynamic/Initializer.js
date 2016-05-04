(function () {
    var responsivetable = new ResponsiveTable({
        instanceId: {%= CurrentADC.InstanceId %},
        headerFixed: {%= CurrentADC.PropValue("headerFixed") %}
    });
} ());