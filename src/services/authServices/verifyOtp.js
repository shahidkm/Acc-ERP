import axios from "axios";
export var verifyOtp=async(data)=>{
    var response =await axios.post("https://localhost:7230/api/Auth/validate-otp",data,{
        headers:{"Content-Type":"multi/form-data"}
    })
    console.log(response);
    return response.data;
  
}

