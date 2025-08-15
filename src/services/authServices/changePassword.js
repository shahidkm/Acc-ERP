import axios from "axios";
export var changePassword=async(data)=>{
    var response =await axios.post("https://localhost:7251/api/Auth/change-password",data,{
        headers:{"Content-Type":"multi/form-data"}
    })
    console.log(response,"-----");
    
    return response.data;
  
}

