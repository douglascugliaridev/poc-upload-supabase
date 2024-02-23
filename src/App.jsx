import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

const supabaseUrl = "URL GERADA NO SUPABASE";
const supabaseKey = "SUA KEY GERADA NO SUPABASE";
let uuidFotos;

const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [userId, setUserId] = useState("");
  const [imgUrl, setImgUrl] = useState([]);
  const [image, setImage] = useState("");

  const getUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user !== null) {
        setUserId(user.id);
      } else {
        setUserId("");
      }
    } catch (e) {}
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    const uuid = uuidv4();
    const file = event.target[0]?.files[0];

    if (!file) return;

    const { data, error } = await supabase.storage
      .from("bucket")
      .upload(userId + "/" + uuid, file, {
        contentType: 'image/jpeg'
      });

    console.log("UUID " + uuid);
    console.log("Data " + data.path);

    uuidFotos = data.path;

    getImgUrl();
  };

  async function getImgUrl() {
    const { data, error } = await supabase.storage
      .from("bucket")
      .getPublicUrl(uuidFotos);

    if (data.publicUrl) {
      setImgUrl(data.publicUrl);
      console.log("ImgUrl " + data.publicUrl);
    } else {
      console.log(71, error);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleUpload}>
          <div id="imagem">
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="Imagem"
                height="150"
                width="150"
              />
            ) : (
              <img
                src="../public/user-icone.png"
                alt="Imagem"
                height="150"
                width="150"
              />
            )}
          </div>
          <br />
          <div id="imageUrl">
            <label id="lb-imagemUrl">Url Imagem: </label>
            <label>{imgUrl}</label>
          </div>
          <br />
          <br />
          <input
            type="file"
            name="image"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <br />
          <br />
          <button type="submit" id="btn-upload">
            Upload
          </button>
        </form>
      </header>
    </div>
  );
}

export default App;
