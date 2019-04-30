

const editable = document.getElementsByClassName('editable');

[].forEach.call(editable, function (el) {
	el.addEventListener('click', function() {    
    el.setAttribute("contenteditable", true);
    el.focus();    
  }, false);
  el.addEventListener('blur', function() {    
    el.setAttribute("contenteditable", false);
    const text = el.outerHTML;
    const id = el.getAttribute("id");
    if (text && id) {
      console.log('id:', id);
      console.log('text:', text);
      
      fetch('http://localhost:3012/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({text: text, id: id})
      }).then(res=>res.json())
        .then(res => console.log(res));
    } else {
      console.log('not data');
      
    }
      
	}, false);
});
