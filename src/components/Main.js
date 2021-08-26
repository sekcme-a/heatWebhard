import React, { useEffect, useState } from "react";
import logo from "../assets/logo/webscript.png";
import user from "../assets/heatInstagramQr.jpg";
import { dbService as db } from "../fbase";
import { Link, useHistory } from "react-router-dom";
import { storageService as ss } from "../fbase";
import { setScheduler } from "bluebird";
import { someSeries } from "async";
import { assertExpressionStatement } from "@babel/types";
import "../App.css"


//현재위치의 모든 파일 표시
export const menuItems = [];

let id=[];
let mimeType = [];
let name = [];
let parentId = [];
let url = [];

//파일속성에 맞는 아이콘 표시 bootstrap
const iconSelect = (mime) => {
  if (mime === "application/vnd.google-apps.folder") //폴더
    return "bi bi-folder"
  else if(mime ==="application/pdf")  //pdf
    return "bi bi-file-earmark-pdf"
  else //설정안함
    return "bi bi-file-earmark-pdf"
}

//현재위치까지의 모든 부모폴더
const Items = [{name: "root", parentId: "", iconClassName:"bi bi-house-door"}]

const Main = (props) => {
  const [inactive, setInactive] = useState(false);
  const [loaded, setLoaded] = useState(false)
  const [clicked, setClicked] = useState(false)
  const history = useHistory();

  //showDB(이동할폴더의 id,이름, parentid, 자식폴더로이동하려면-2, 부모폴더이동시-1, 아니면 0)
  const showDB = (did, dname, dparentId, toChild) => {
    let icon;
    menuItems.splice(0, menuItems.length)

    for (let i = 0; i < name.length; i++){
      if (parentId[i] === did) {
        icon = iconSelect(`${mimeType[i]}`)
        menuItems.push({name: name[i], iconClassName: icon, id: id[i], parentId: parentId[i], url: url[i]})
      }
    }
    
    if (toChild === -2) {   //자식폴더로 이동
      Items.push({ name: dname, parentId: dparentId, iconClassName: "bi bi-arrow-left-short" })
    } else if (toChild === -1) {  //부모폴더로 이동
      Items.pop()
    } else {
      for (let j = 0; j < toChild; j++)
        Items.pop()
    }
    sortAsChar();
    setLoaded(!loaded)
  }
  //문자 오름차순 정렬
  const sortAsChar = () => {
    menuItems.sort(function (a, b) {
      let x = a.name.toLowerCase();
      let y = b.name.toLowerCase();
      if (x < y) return -1;
      if (x > y) return 1;
      return 0;
    })
  }

  useEffect(() => {
    if (inactive) {
      removeActiveClassFromSubMenu();
    }

    props.onCollapse(inactive);
  }, [inactive]);

  //just an improvment and it is not recorded in video :(
  const removeActiveClassFromSubMenu = () => {
    document.querySelectorAll(".sub-menu").forEach((el) => {
      el.classList.remove("active");
    });
  };

  //---------------------------------------------------------------------------------------------
  useEffect(() => {
  ss.ref().child("/test.json").getDownloadURL().then((url) => {
      
    })
  }, [])
  

//처음 웹에 들어왔을때만 DB불러오기
 const loadDB = async() => {
    await db.collection("root").doc("root").get().then((res) => {
      id = JSON.parse(JSON.stringify(res.data().id));
      // console.log(id)
      mimeType = JSON.parse(JSON.stringify(res.data().mimeType));
      // console.log(mimeType)
      name = JSON.parse(JSON.stringify(res.data().name));
      // console.log(name)
      parentId = JSON.parse(JSON.stringify(res.data().parentId));
      // console.log(parentId)
      url = JSON.parse(JSON.stringify(res.data().url));
      // console.log(url)
    })
  }
  
  
  
  useEffect(async() => {
    await loadDB()
    showDB(props.id) //
    let menuItems = document.querySelectorAll(".menu-item");
    menuItems.forEach((el) => {
      el.addEventListener("click", (e) => {
        const next = el.nextElementSibling;
        removeActiveClassFromSubMenu();
        menuItems.forEach((el) => el.classList.remove("active"));
        el.classList.toggle("active");
        if (next !== null) {
          next.classList.toggle("active");
        }
      });
    });
  }, []);



  //App클래스의 바뀐 css돌려주기
  const appStyle = {
    "display": "flex",
    "width": "100%",
    "height": "100%",
  }

  const onNavClick = () => {
    history.push('/navi')
  }

  return (
    <div className="appp" style={appStyle}>
      <div className={`side-menu ${inactive ? "inactive" : ""}`}>
      <div className="top-section">
        <div className="logo">
          <img src={logo} alt="webscript" />
        </div>
        <div onClick={() => setInactive(!inactive)} className="toggle-menu-btn">
          {inactive ? (
            <i class="bi bi-arrow-right-square-fill"></i>
          ) : (
            <i class="bi bi-arrow-left-square-fill"></i>
          )}
        </div>
      </div>

      <div className="search-controller">
        <button className="search-btn">
          <i class="bi bi-search"></i>
        </button>

        <input type="text" placeholder="search" />
      </div>

      <div className="divider"></div>

      <div className="main-menu">
          <ul>
          { //현재 위치하고 있는 폴더 표시 + 누르면 전 폴더로 이동
            <li>
                <Link
                  onClick={() => {
                    Items.length!==1 &&
                    showDB(Items[Items.length-1].parentId,null, null, -1)
                  }}
                  className={`menu-item naviForParentFolder`}
                >
                  <div className="menu-icon naviForParentFolder">
                    <i className={Items[Items.length-1].iconClassName}></i>
                  </div>
                  <span>{Items[Items.length-1].name}</span>
                </Link>
              </li >
          }
          {
            //사이드바에 해당 경로 아이템들 나열
            menuItems.map((menuItem, index) => (
              <li>
                <Link
                  onClick={() => {
                    menuItem.iconClassName==="bi bi-folder" ?
                    (showDB(menuItem.id,menuItem.name,menuItem.parentId, -2)
                      ) : (
                      window.open(menuItem.url)
                    )
                  }}
                  className={`menu-item`}
                >
                  <div className="menu-icon">
                    <i className={menuItem.iconClassName}></i>
                  </div>
                  <span>{menuItem.name}</span>
                </Link>
              </li >
            ))
            }
        </ul>
      </div>

      <div className="side-menu-footer">
        <div className="avatar">
          <img src={user} alt="user" />
        </div>
        <div className="user-info">
          <h5>HEAT</h5>
          <p>hit_heat@naver.com</p>
            {/* <i onClick={onLogOutClick} class="bi bi-door-open"></i> */}
            <i onClick={onNavClick} class="bi bi-door-open"></i>
        </div>
      </div>
      </div>
      <div className={`asdf ${inactive ? "inactive" : ""}`}></div>
      <div className="main-content">
        <div className="asdf2">
          <div className="asdf3">
            <div className="location">
              {Items.map((Item, key) => (
                <div key={key}>{`${Item.name}/`}</div>
                // onClick={onClick(Item.name)}
              ))}
            </div>
          </div>
        </div>
        <div className="itembox">
          {
          //사이드바에 해당 경로 아이템들 나열
          menuItems.map((menuItem, index) => (
              <div
                onClick={() => {
                  menuItem.iconClassName==="bi bi-folder" ?
                  (showDB(menuItem.id,menuItem.name,menuItem.parentId, -2)
                    ) : (
                    window.open(menuItem.url)
                  )
                }}
              className="item"
              >
                <i className={menuItem.iconClassName}></i>
              <div>{menuItem.name}</div>
              </div>
            ))
          }
        </div>
      </div>
      <div className="background"></div>

      </div>
  );
};

export default Main;