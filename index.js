document.addEventListener("DOMContentLoaded", function () {
    const inputLeft = document.querySelector(".inp-left");
    const inputRight = document.querySelector(".inp-right");
    const currencyBtnsLeft = document.querySelectorAll(".nav-left-btn");
    const currencyBtnsRight = document.querySelectorAll(".nav-right-btn");
  
    function setDefaultValues() {
      inputLeft.value = '1';
      validateInput(inputLeft);
      updateConversion();
    }
    setDefaultValues();
  
    currencyBtnsLeft.forEach(function (btn) {
      btn.addEventListener("click", function () {
        currencyBtnsLeft.forEach(function (el) {
          el.classList.remove("nav-left-btn-active");
        });
        btn.classList.add("nav-left-btn-active");
  
        updateConversion();
      });
    });

   
  
    inputLeft.addEventListener("input", function () {
      validateInput(inputLeft);
      updateConversion();
    });
  
  
    currencyBtnsRight.forEach(function (btn) {
      btn.addEventListener("click", function () {
        currencyBtnsRight.forEach(function (el) {
          el.classList.remove("nav-right-btn-active");
        });
        btn.classList.add("nav-right-btn-active");
    
        updateConversion(); 
      });
    });
    inputRight.addEventListener("input", function () {
      validateInput(inputRight);
      updateConversionFromRight();
    });

    
  
    function updateConversion() {
      const amount = parseFloat(inputLeft.value);
      const baseCurrency = document.querySelector(".nav-left-btn-active").innerText;
      const targetCurrency = document.querySelector(".nav-right-btn-active").innerText;
       
      if (isNaN(amount)) {
        inputRight.value = '';
        return;
    }
  
      if (baseCurrency === targetCurrency) {
        inputRight.value = inputLeft.value; 
        return;
      }
  
      fetch(`https://v6.exchangerate-api.com/v6/341bca8980344927b5c50d38/latest/${baseCurrency}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch exchange rates');
          }
          return res.json();
        })
        .then((data) => {
          const rate = data.conversion_rates[targetCurrency];
          if (!rate) {
            throw new Error('Exchange rate not available');
          }
          inputRight.value = (amount * rate).toFixed(5);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          alert("Something went wrong. Please try again later.");
        });
    }
    
    function updateConversionFromRight() {
      const amount = parseFloat(inputRight.value);
      const baseCurrency = document.querySelector(".nav-right-btn-active").innerText;
      const targetCurrency = document.querySelector(".nav-left-btn-active").innerText;
      
      if (isNaN(amount)) {
        inputLeft.value = '';
        return;
    } 
  
      if (baseCurrency === targetCurrency) {
        inputLeft.value = inputRight.value; 
        return;
      }
  
      fetch(`https://v6.exchangerate-api.com/v6/341bca8980344927b5c50d38/latest/${baseCurrency}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch exchange rates');
          }
          return res.json();
        })
        .then((data) => {
          const rate = data.conversion_rates[targetCurrency];
          if (!rate) {
            throw new Error('Exchange rate not available');
          }
          inputLeft.value = (amount / rate).toFixed(5);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          alert("Something went wrong. Please try again later.");
        });
    }

  });
  

  
  const validateInput = (input) => {
    let value = input.value
      .replace(/,/g, '.')
      .replace(/[^0-9.]/g, '')
      .replace(/(\.[^.]*\.)+/g, '$1')
      .replace(/(\.\d*)\./g, '$1');
  
    if (value.startsWith('.') && !/\d+\./.test(value)) {
      value = '0' + value;
    }
  
    input.value = value;
  };