// document.addEventListener('DOMContentLoaded', getButton);

// DELETING ROW FUNCTION
function deleteRow(tableName, idString) {

   console.log(tableName + " " + idString);
   var req = new XMLHttpRequest();

   var urlQuery = '/delete?table=' + tableName + '&id=' + idString;

   req.open('GET', urlQuery, true);

   req.addEventListener('load', function() {
      console.log(req.status);
      if(req.status >= 200 && req.status < 400) {
         response = JSON.parse(req.responseText);

         // function to delete the row that was chosen
         function deleteCertainRow(thisId) {
            console.log(thisId);
            document.getElementById('tableBody').removeChild(document.getElementById(thisId));
         }
         deleteCertainRow(response.id);
      }
      else {
         console.log('Error in network request: ' + request.statusText);
      }
   });

   req.send(null);
}
