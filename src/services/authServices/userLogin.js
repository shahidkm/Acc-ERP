import axios from "axios";
export var userLogin=async(data)=>{
    var response =await axios.post("https://localhost:7230/api/Auth/login",data,{
        headers:{"Content-Type":"multi/form-data"}
    })
    localStorage.setItem("Token",response.data.token);
    localStorage.setItem("UserId",response.data.userId)
    return response.data;
  
}

