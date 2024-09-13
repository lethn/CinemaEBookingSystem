<%@ page language="java" contentType="text/html"%> 
    
<!DOCTYPE html> 
<head> 
    <title>Login</title> 
</head> 
<body> 
    <div class="container"> 
        <form action="user"> 
            <div class="row"> 
                <label for="name">Enter your username:</label> <input type="text"
                    id="name" name="name"> 
            </div> 
            <div class="row"> 
                <label for="pass">Enter your Password:</label> <input
                    type="password" id="pass" name="password"> 
            </div> 
            <div class="row"> 
                <button class="btn">Submit</button> 
            </div> 
        </form> 
    </div> 
</body> 
</html>