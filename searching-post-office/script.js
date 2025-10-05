document.addEventListener("DOMContentLoaded", function(){
   let userIP = "";
    fetch("https://api.ipify.org/?format=json")
     .then(response => response.json())
     .then(data=>{
      userIP = data.ip;
        document.getElementById("ip-address").textContent = userIP;
     })
     .catch(error=>{
        console.log("Error fetching IP address:", error);
     });

document.getElementById("getData").addEventListener("click", async()=>{
   if(!userIP) return alert("IP not found");
   try{
      let res = await fetch(`https://ipinfo.io/${userIP}/geo`);
      let info = await res.json();
      const [longitude, latitude] = info.loc.split(",");

      document.getElementById("user-ip").textContent = info.ip;
      document.getElementById("latitude").textContent = latitude;
      document.getElementById("longitude").textContent = longitude;
      document.getElementById("city").textContent = info.city;
      document.getElementById("region").textContent = info.region;
      document.getElementById("organisation").textContent = info.org;
      document.getElementById("hostname").textContent = info.hostname || "N/A";
      document.getElementById("time-zone").textContent = info.timezone;
      
      document.getElementById("map").innerHTML = `
       <iframe width="100%" height="250" style="border:0"
        src="https://www.google.com/maps?q=${latitude},${longitude}&hl=es;&output=embed">
        </iframe>
      `;
      fetchPostOffices(info.postal);
   }catch(err){
      console.error("Error fetching user info:", err);
   }
});

async function fetchPostOffices(pincode){
   try{
      let res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      let data = await res.json();
      let postOffices = data[0].PostOffice;

      renderPostOffices(postOffices);

      const searchInput = document.querySelector("#post-offices input");
      searchInput.addEventListener("input", (e)=>{
         const keyword = e.target.value.toLowerCase();
         const filtered = postOffices.filter(
            (po)=>
               po.Name.toLowerCase().includes(keyword) ||
               po.BranchType.toLowerCase().includes(keyword)
         );
         renderPostOffices(filtered)
      });
   }catch(err){
      console.error("Error fetching post offices:", err);
   }
}

function renderPostOffices(list){
   let ul = document.getElementById("post-office-list");
   ul.innerHTML = "";
   if(!list || list.length === 0){
      ul.innerHTML = "<li>No post offices found</li>";
      return;
   }
   list.forEach((po)=>{
      let li = document.createElement("li");
      li.innerHTML = `<strong>${po.Name}</strong> (${po.BranchType})<br/>
                      <b>District:</b> ${po.District} <br/>
                      <b>State:</b> ${po.State} <br/>
                      <b>Pincode:</b> ${po.Pincode}`;
      ul.appendChild(li);
   });
}
});