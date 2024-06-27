document.getElementById('submit-btn').addEventListener('click', function() {
    var loadingBar = document.getElementById('loading-bar');
    var resultArea = document.getElementById('result');

    // Reset the result area
    resultArea.value = '';

    // Show loading bar animation
    loadingBar.style.width = '0';
    setTimeout(() => {
        loadingBar.style.width = '100%';
    }, 10); 

    // Collect form data
    var formData = new FormData(document.getElementById('parameter-form'));
    var data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

   
    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(json => {
        
        setTimeout(() => {
            loadingBar.style.width = '0';
        }, 500); 
        resultArea.value = json.result;
    });
});
