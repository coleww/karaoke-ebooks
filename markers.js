function installMarkers(num){
  var markerRow = document.createElement("div")
  markerRow.setAttribute("class", "beat-markers");

  for(var i = 0; i < num; i++){
    var marker = document.createElement("div");
    marker.setAttribute("class", "marker")
    marker.setAttribute("data-index", i);
    markerRow.appendChild(marker);
  }

  document.body.appendChild(markerRow);
};

function updateMarkers(position, num){
  lastPosition = position - 1;
  if(lastPosition < 0){
    lastPosition = num - 1;
  }
  document.querySelector('.marker[data-index="'+lastPosition+'"]').classList.remove('active');

  document.querySelector('.marker[data-index="'+position+'"]').classList.add('active');
}

module.exports = {
  installMarkers: installMarkers,
  updateMarkers: updateMarkers
}