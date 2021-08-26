import React from "react"
import "./Navi.css"
import { useHistory } from "react-router-dom";
import { authService } from "../fbase";

const Navi = () => {
  const history = useHistory();
  const onLogOutClick = async() => {
    await authService.signOut();
    history.push("/"); //로그아웃시 메인페이지로 돌아가게
  };
  return (
    <section className="Navi">
      <div className="color"></div>
      <div className="color"></div>
      <div className="color"></div>
      <div className="color"></div>
      <ul className="Navi">
        <li><a href="/"><i class="bi bi-arrow-left-circle"></i></a></li>
        <li><a href="https://instagram.com/hit_heat_?utm_medium=copy_link"><i className="bi bi-instagram"></i></a></li> 
        <li><a href="https://open.kakao.com/o/gc56qy7b"><i className="bi bi-chat-quote"></i></a></li>
        <li><a href="https://blog.naver.com/hit_heat"><i class="bi bi-bootstrap"></i></a></li>
        <li onClick={onLogOutClick}><a href="#"><i class="bi bi-door-closed"></i></a></li>
      </ul>
    </section>
  )
}

export default Navi;