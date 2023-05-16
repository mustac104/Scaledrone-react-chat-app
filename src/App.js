import {useState,useEffect} from "react";
import Messages from './components/Messages';
import Input from "./components/Input";
import Login from "./components/Login";
import getAvatar from "./components/getAvatar";

function App(){
  
  const [user, setUser] = useState("");
  const [drone, setDrone] = useState(null);

  const [username, setUsername] = useState(null);
  const [avatarMe, setAvatarMe] = useState(null);
  const [error, setError] = useState("");

  const [messageArray, setMessageArray] = useState([]);



    function onUserLogin(username) {
        const avatar = getAvatar();
        setAvatarMe(avatar);
        if (username) {
          const drone = new window.Scaledrone("ERPcKaXePEWKvGuU", {
            data: { username, avatar},
          });
          drone.on("open", () => {
            setDrone(drone);
            setUser({ id: drone.clientId, username, avatar });
          });
        }
    }

    const rukujPromjenomKorisnika = event => {
        const vrijednost = event.target.value;
        setUsername(vrijednost);
    }
    const rukujPredajomKorisnika = event => {
        event.preventDefault();
        
        if (!username || !username.replace(/\s/g, "").length) {
          setUsername(null);
          alert("Za Upis korisnika morate ispravno popuniti podatke");
        } else {
          setError(null);
          onUserLogin(username);
        }
        
    }
    const rukujPredajomPodataka = async (message) => {
      if (message.length > 0) {
        try {
          await drone.publish({
            room: "observable-room",
            message
          });
        } catch (error) {
          console.error("Error occurred while publishing:", error);
        }
      }
    };
    
    
    useEffect(() => {
      if (user) {
        setupRoom(drone);
      }
    }, [user, drone]);

    function setupRoom(scaledrone) {
      scaledrone.on("error", (error) => console.error(error));
      const room = scaledrone.subscribe("observable-room");
      room.on("error", (error) => console.error(error));
      room.on("message", (message) => {
      setMessageArray((current) => {
        return [
            ...current,
            {
              message: message.data,
              user: {
                id: message.member.id,
                username: message.member.clientData.username,
                avatar: message.member.clientData.avatar,
              },
            },
          ];
        });
      });

    
    }
    const forma = user.length < 1 ? <Login rukujPredajomKorisnika={rukujPredajomKorisnika} rukujPromjenomKorisnika=   {rukujPromjenomKorisnika} /> : <Input onSendMessage =  {rukujPredajomPodataka} />;
    const prikazporuka  = messageArray.length < 1  ? "" :   <Messages messages={messageArray} memberMe={username} meAvatar={avatarMe}/>
      
    return (
          <div className="App" >
              <div className="App-header" >
                <h1>My Chat App</h1>
              </div>
              {prikazporuka}
              {forma}
          </div>
    ); 

  }
export default App;