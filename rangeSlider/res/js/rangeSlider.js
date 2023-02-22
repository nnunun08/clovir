var RangeSlider = function(id, option) {
    this.id = id;
    $("#" + id).addClass("range-slider");
    this.inputId =  $("#" + id).attr("data-id");
    if(!this.inputId){
        this.inputId = this.id + "_range";
    }
    this.setValue = function(val){
        $("#" + this.inputId).val(val)
        $("#" + this.inputId).trigger("input");
    }
    this.getValue = function(){
        if($("#" + this.id + " input:checkbox").prop("checked")){
            return -1;
        }

        return 1* $("#" + this.inputId).val();
    }

    this.draw = function (option) {
        if (!option.step) {
            option.step = 1;
        }
        if (!option.min) {
            option.min = 0;
        }
        if (!option.default) {
            option.default = option.min;
        }
        if (!option.leftBarColor) {
            option.leftBarColor = 'blue';
        }
        if (!option.rightBarColor) {
            option.rightBarColor = 'lightgray';
        }
        this.option = option;
        var htmlInput = $('<input/>', {
            id:   this.inputId,
            name: this.inputId,
            min: option.min,
            type: 'range',
            max: option.max,
            step: option.step,
            threshold: option.threshold,
            class:'range'

        })
        var htmlOutput = ($('<output/>', {class: 'bubble'}));
        var htmlDiv = $('<div/>', {class: 'range-slider__progress'});
        var divObj = $("#" + this.id  );

        var obj  = divObj.html(htmlInput);

        obj.append(htmlOutput);
        var thresholdPercent = 0;
        if(option.threshold) {
            thresholdPercent = Math.floor((option.threshold - option.min) / (option.max - option.min) * 100);
            obj.append($('<div/>', {class: 'threshold', style:'--left:' + (thresholdPercent-3) + '%;--text-threshold:"' + ( option.threshold) + '"'}));
        }

        obj.append(htmlDiv);
        if(option.allowNoLimit){
            obj.append("<label class='noLimitDiv'><input type='checkbox' onclick='clickNoLimit(this)'>무제한</label>")
        }
        var rangeObjObj = $("#" + this.inputId);
        var that = this;
        rangeObjObj.on("input", function(event){
            if(that.option.greaterThanDefault && this.value<that.option.default){
                event.preventDefault();
                that.setValue(that.option.default)
                return false;
            }
            this.parentNode.style.setProperty('--value',this.value);
            this.parentNode.style.setProperty('--text-value', JSON.stringify(this.value))
        })
        //기본 input_slider
        rangeObjObj.attr("max", option.max);
        rangeObjObj.attr("step", option.step);
        rangeObjObj.attr("min", option.min);
        rangeObjObj.attr("value", option.default);
        rangeObjObj.css('text-indent', '-10000px');
        rangeObjObj.css('--primary-color', option.rightBarColor);

        //sliderCsss
        divObj.css("--max", option.max);
        divObj.css("--min", option.min);
        divObj.css("--step", option.step);
        divObj.css("--value", option.default);
        divObj.css("--text-value", option.default);

        //기본색상,임계값
        if (option.threshold === "" || option.threshold === undefined) {
            divObj.css("--fill-color", option.leftBarColor);
            rangeObjObj.css("--fill-color", option.leftBarColor);
        } else {

            divObj.css("--fill-color", "linear-gradient(to right," + option.leftBarColor + " " + thresholdPercent + "%, " + option.rightBarColor + " " + "0%)");
            rangeObjObj.css("--fill-color", "linear-gradient(to right," + option.leftBarColor + " " + thresholdPercent + "%, " + option.rightBarColor + " " + "0%)");
        }
        divObj.css("--primary-color", option.rightBarColor);
    }
    if(option){
        this.draw(option);
    }
}

function  clickNoLimit (obj){
    var input = $(obj).parent().parent().find("input:first")
    input.prop("disabled",$(obj).prop("checked"))
    if($(obj).prop("checked")){
        input.val(999);
    }
    else{
        input.val(input.attr("min"));
        input.trigger("input");
    }

}