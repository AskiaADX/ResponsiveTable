(function () {
    var responsivetable = new ResponsiveTable({
        instanceId: {%= CurrentADC.InstanceId %},
        headerFixed: {%= CurrentADC.PropValue("headerFixed") %},
        currentQuestion: '{%:= CurrentQuestion.Shortcut %}',
        maxItemsPerScreen: '{%= CurrentADC.PropValue("maxItemsPerScreen") %}',
        responsiveWidth : '{%= CurrentADC.PropValue("responsiveWidth") %}',
        accordion : {%= CurrentADC.PropValue("accordion") %},
        expandableHeaders : {%= (CurrentADC.PropValue("expandableHeaders") = "1") %},
        accordionInitialState : '{%= CurrentADC.PropValue("accordionInitialState") %}',
        type: '{%:= CurrentQuestion.Type %}'
    });
} ());
