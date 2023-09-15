function help(){
  return "<h2><span style=\"color:#eb926d;\">Help:</span></h2><table>\
  <tr>\
    <td>all</td>\
    <td>All commands together.</td>\
  </tr>\
  <tr>\
    <td>about</td>\
    <td>About Emir</td>\
  </tr>\
  <tr>\
    <td>certificates</td>\
    <td>Emir got some certificates. Wants you to look it up.</td>\
  </tr>\
  <tr>\
    <td>links</td>\
    <td>Emir wants you to click these.</td>\
  </tr>\
  <tr>\
    <td>genre</td>\
    <td>See things Emir good about.</td>\
  </tr>\
  <tr>\
    <td>contact</td>\
    <td>Get contact with Emir.</td>\
  </tr>\
  <tr>\
    <td>other</td>\
    <td>Some extra commands.</td>\
  </tr>\</table>";
}

function certificates(){
  return "<h2><span style=\"color:#0F969C;\">📜Certificates:</span></h2><table>\
  <tr>\
  <td></td>\
  <td>🏆 2021 e-Twinning European Quality Label Certificate</td>\
</tr>\
<tr>\
<td></td>\
  <td>🏆 2022 e-Twinning European Quality Label Certificate</td>\
</tr>\
<tr>\
<td></td>\
  <td>🌍 2021 Erasmus+ Portugal Lisbon Trip / Erasmus+ Participation Certificate</td>\
</tr>\
<tr>\
<td></td>\
  <td>🔬 4006-TÜBİTAK Science Fair Support Program Participation Certificate</td>\
  <tr>\
  <td></td>\
  <td>-------🌎Languages🌍-------</td>\
</tr>\
<td></td>\
<td>🇹🇷 C2 Level - Native Turkish</td>\
</tr>\
<td></td>\
<td>🇬🇧/🇺🇸 B2 Level - Upper Intermediate English</td>\
</tr>\
<td></td>\
<td>🇩🇪 A1 Level - Beginner German</td>\
</tr>\
</tr></table>";
}

function contact(){
  return "<h2><span style=\"color:#0F969C;\">📞Contact:</span></h2><table>\
  <td></td>\
  <li>Errors can often occur. Errors are there to be corrected. If errors are not corrected, there can always be a deficiency and inadequacy. Therefore, if you encounter any deficiencies or inadequacies on this site, please contact us.</li>\
</tr>\
<td></td>\
<li>Additionally, please inform us of any features you would like to be added or removed from our site. We will make the most suitable decision for the community.</li>\
</tr>\
<td></td>\
<li><a href=\"https://www.instagram.com/e3m1rrq/\" target=\"_blank\"><i class=\"fab fa-instagram\"></i> Instagram</a></li>\</tr>\
<td></td>\
</tr>\
</tr></table>";
}

function genre(){
  return "<h2><span style=\"color:#676f9d;\">📈Genres:</span></h2><table>\
  <tr>\
    <td>JavaScript</td>\
    <td>▰▰▰▰▰▰▰▱▱▱ 70%🟢</td>\
  </tr>\
  <tr>\
  <td>Python</td>\
    <td>▰▰▰▰▰▱▱▱▱▱ 50%🟡</td>\
  </tr>\
  <tr>\
  <td>HTML</td>\
    <td>▰▰▰▰▰▰▰▱▱▱ 70%🟢</td>\
  </tr>\
  <tr>\
  <td>CSS</td>\
    <td>▰▰▰▰▰▰▰▱▱▱ 70%🟢</td>\
  </tr>\
  <tr>\
  <td>➕ Have experience in C , C+ , C++.</td>\
    <td>➕ Had Arduino and React courses.</td>\
  </tr></table>";
}

function about(){
  return "<p>👤- Every line of code is the key to unlocking uncharted realms of software.</p>";
}

function quick(){
  return "<p>You just performed ablution👌. (Quickabdest)</p>";
}

function purpose(){
  return "<p>Haven't you grown tired of regular, click-driven websites that just guide you along? See only what you want to see. That's why I've set up a console (terminal) themed website. I will use this site as my CV and e-portfolio in the present and future. But don't worry, the site will never stay like this. I will continually add more content and make it even more beautiful. So, the site will never die :).</p>";
}

function weather(){
  return "<p>Just look outside through the window.</p>";
}

function npass(){
  return "<p>Not really.</p>";
}

function jsu(){
  return "<p>Still doing this in 2023?? damn.</p>";
}

function whoami(){
  return "<p>Visitor.</p>";
}

function other(){
  return "<h2><span style=\"color:#676f9d;\">Other:</span></h2><table>\
    <tr>\
      <td>jsu</td>\
      <td>Idk how this works. Try it out.</td>\
    </tr>\
    <tr>\
    <td>quick</td>\
      <td>Allows you to perform ablution in miliseconds (Quickabdest)</td>\
    </tr>\
    <tr>\
    <td>whoami</td>\
      <td>Tells who you are.</td>\
    </tr>\
    <tr>\
    <td>npass</td>\
      <td>Free N-Word Pass</td>\
    </tr>\
    <tr>\
    <td>weather</td>\
      <td>A(normal) weather forecast.</td>\
    </tr>\
    <tr>\
    <td>purpose</td>\
      <td>The purpose of this website.</td>\
    </tr>\
    </tr></table>";
}

function links(){
  return "<span style=\"color: #6DA5C0;\"><h2>🔗Links:</h2></span><ul>\
  <li><a href=\"https://open.spotify.com/user/31tsxmadimijk3aofa3yh5pskjhy?si=751caad4c16d43ca&nd=1\" target=\"_blank\"><i class=\"fab fa-spotify\"></i> Spotify</a></li>\
  <li><a href=\"https://www.instagram.com/e3m1rrq/\" target=\"_blank\"><i class=\"fab fa-instagram\"></i> Instagram</a></li>\
  <li><a href=\"https://github.com/e3m1rrq\" target=\"_blank\"><i class=\"fab fa-github\"></i> Github</a></li>\
  <li><a href=\"https://lichess.org/@/masterbusyon\" target=\"_blank\"><i class=\"♚\"></i> ♚ Lichess</a></li>\
  </ul>";
}

function commandProcessor(e){

  if(e.keyCode == 13){

    document.getElementById('injected').innerHTML= "";

    var txtInput = document.getElementById('txtBox').value;

    if(txtInput == "help"){
      document.getElementById('injected').innerHTML=help();
    }else if (txtInput=="all") {
      document.getElementById('injected').innerHTML=about() + "\n\n\n" + certificates() + "\n\n\n" + genre() + "\n\n\n" + links() + "\n\n\n" + contact();
    }else if (txtInput == "about") {
      document.getElementById('injected').innerHTML=about();
    }else if (txtInput == "certificates") {
      document.getElementById('injected').innerHTML=certificates();
    }else if (txtInput == "contact") {
      document.getElementById('injected').innerHTML=contact();
    }else if (txtInput == "quick") {
      document.getElementById('injected').innerHTML=quick();
    }else if (txtInput == "purpose") {
      document.getElementById('injected').innerHTML=purpose();
    }else if (txtInput == "weather") {
      document.getElementById('injected').innerHTML=weather();
    }else if (txtInput == "whoami") {
      document.getElementById('injected').innerHTML=whoami();
    }else if (txtInput == "npass") {
      document.getElementById('injected').innerHTML=npass();
    }else if (txtInput=="genre") {
      document.getElementById('injected').innerHTML=genre();
    }else if (txtInput=="links") {
      document.getElementById('injected').innerHTML=links();
    }else if (txtInput == "jsu") {
      var win = window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", '_blank');
      win.focus();
      document.getElementById('injected').innerHTML=jsu();
    }else if (txtInput == "other") {
      document.getElementById('injected').innerHTML=other();
    }else{
      document.getElementById('injected').innerHTML = help();
    }

    document.getElementById('txtBox').value= "";
  }
}
