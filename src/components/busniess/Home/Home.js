import React, { Component } from "react";
import "./Home.less";
import { Menu, Icon, Button, Tabs, Upload, Popover ,Alert} from "antd";
import logo from "../../../assets/images/1556898894199.jpg";
import NoticeList from "../NoticeList";
import ApplyDataBase from "../ApplyDataBase";
import ApplyProject from "../ApplyProject";
import ActApply from "../ActApply";
import MenuDataBase from "../MenuDataBase/MenuDataBase";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MenuCommittee from "../MenuCommittee";
const { TabPane } = Tabs;

class Home extends Component {
  state = {
    collapsed: false,
    imageUrl: "",
    userInfo: {},
    currentItem:1
  };
  constructor(props){
    super(props);
  }
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };
  componentDidMount = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.setState({
      userInfo
    });
  };
  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  handleChange = info => {
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false
        })
      );
    }
  };
  logout = () => {
    console.log("logout",this.props)
    localStorage.removeItem("userInfo");
    this.props.history.replace({
      pathname:"/"
    })
  }
  onMenuDetail = (name) => {
    if(name === 'home'){
      this.setState({
        currentItem:1
      })
    }else{
      this.setState({
        currentItem:2
      })
    }
    this.props.history.push({
      pathname:`/${name}`
    })
  }
  render() {
    const uploadButton = (
      <div>
        {/* <Icon type={this.state.loading ? 'loading' : 'plus'} /> */}
        <div className="ant-upload-text">请上传照片</div>
      </div>
    );
    const content = (
      <React.Fragment>
      {/* <div> <Button type="primary" icon="download" size='small' >退出</Button></div> */}
      <div style={{margin:"10px 0 "}}> <Button type="primary" icon="logout" size='small' onClick={this.logout}>退出</Button>
      </div>
       </React.Fragment>
    )
    const { imageUrl, userInfo ,currentItem} = this.state;
    return (
      <div className="home">
        <div className="home-left">
          <Menu
            defaultSelectedKeys={[`${currentItem}`]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
            theme="dark"
            style={{ height: "100vh" }}
            inlineCollapsed={this.state.collapsed}
          >
            <div className="home-left-logo">
              <img className="home-left-logo-img" src={logo}></img>
            </div>
            <Menu.Item key="1" onClick={
              () => {
                this.onMenuDetail('home')
              }
            }>
              <Icon type="pie-chart" />
              <span>CHASE-IBD数据库</span>
            </Menu.Item>
            <Menu.Item key="2" onClick={() => {
              this.onMenuDetail('menuCommittee')
            }}>
              <Icon type="desktop" />
              <span>数据库委员会</span>
            </Menu.Item>
          </Menu>
        </div>
        <div className="home-right">
          <div className="home-right-top">
            <div className="home-right-top-tabs">

        {/* <Route exact path='/' component={Login}></Route> */}
        <Route  path='/home' component={MenuDataBase}></Route>
        <Route  path='/menuCommittee' component={MenuCommittee}></Route>
           {/* <MenuDataBase></MenuDataBase> */}
            </div>

            <div className="home-right-top-user">
              {/* <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                onChange={this.handleChange}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
                ) : (
                  uploadButton
                )}
              </Upload> */}
            <Popover content={content} placement="bottom" >
                <div >
                  <Icon type="user" style={{ fontSize: "20px" }} />
                </div>
                <div >{userInfo.Data}</div>
                </Popover>
              {/* <div> <Icon type="logout" style={{fontSize:"20px"}} /></div> */}
            </div>
          </div>
          <div className="home-right-content">
            <div></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
