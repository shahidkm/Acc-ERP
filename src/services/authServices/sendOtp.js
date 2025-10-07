import axios from "axios";
export var sendOtp=async(data)=>{
    var response =await axios.post("https://localhost:7230/api/Auth/forget-password",data,{
        headers:{"Content-Type":"multi/form-data"}
    })
    console.log(response,"-----");
    
    return response.data;
  
}

