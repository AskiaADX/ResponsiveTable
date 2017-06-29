(function () {
    var responsivetable = new ResponsiveTable({
        instanceId: {%= CurrentADC.InstanceId %},
        headerFixed: {%= CurrentADC.PropValue("headerFixed") %},
        currentQuestion: '{%:= CurrentQuestion.Shortcut %}',
        responsiveWidth : '{%= CurrentADC.PropValue("responsiveWidth") %}',
        accordion : {%= CurrentADC.PropValue("accordion") %}
    });
} ());