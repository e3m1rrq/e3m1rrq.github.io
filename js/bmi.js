document.addEventListener("DOMContentLoaded", function() {
    var weightInput = document.getElementById("weight");
    var heightInput = document.getElementById("height");

    weightInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            calculateBMI();
            heightInput.focus();
        }
    });

    heightInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            calculateBMI();
            weightInput.focus();
        }
    });
});

function calculateBMI() {
    var weight = parseFloat(document.getElementById("weight").value);
    var height = parseFloat(document.getElementById("height").value);

    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        document.getElementById("result").innerText = "Please enter a valid weight and height.";
        return;
    }

    var bmi = weight / (height * height);

    var resultText;
    if (bmi < 18.5) {
        resultText = "Thin";
    } else if (bmi < 25) {
        resultText = "Normal";
    } else if (bmi < 30) {
        resultText = "Overweight";
    } else {
        resultText = "Obesse";
    }

    document.getElementById("result").innerText = "BMI: " + bmi.toFixed(2) + " - Durum: " + resultText;
}
