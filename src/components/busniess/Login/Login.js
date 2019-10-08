import React, { Component } from "react";
import "./Login.less";
import http from "../../../utils/api";
import { Form, message, Icon, Input, Button, Spin } from "antd";
const doctorInfoId = "622204211916";
class Login extends Component {
  state = {
    disabled: false,
    counts: 60,
    showSpin: false
  };

  componentDidMount = () => {};

  login = async e => {
    const { form } = this.props;
    const loginData = {
      mobileno: form.getFieldValue("phone"), // 手机号
      validCode: form.getFieldValue("valid"), // 验证码
      loginMethod: "mobile",
      useCookie: true
    };
    e.preventDefault();
    let res;
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }
      this.setState({
        showSpin: true
      });
      try {
        res = await http().login(loginData);
        if (res.data.OpResult == "Y") {
          message.success("登录成功");
          localStorage.setItem("userInfo", JSON.stringify(res.data));
          this.props.history.location.state && (await this.saveDoctorData());
          this.setState({
            showSpin: false
          });
          this.props.history.push({
            pathname: "/home"
          });
        } else {
          message.error(res.data.ErrorMsg);
        }
      } catch (error) {
        message.error(error.message);
      }
    });
  };

  componentWillUnmount() {
    // 卸载异步操作设置状态
    this.setState = (state, callback) => {
      return;
    };
  }
  saveDoctorData = async () => {
    let doctorData = this.props.history.location.state.doctorData;
    let res;
    try {
      res = await http().addRecords({
        resid: doctorInfoId,
        data: [doctorData]
      });
      if (res.data.Error === 0) {
        // message.success("添加成功");
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  countDown = () => {
    let counts = 60;
    this.setState({
      disabled: true
    });
    let countdown = setInterval(() => {
      if (counts > 0) {
        counts--;
        this.setState({
          counts
        });
      } else {
        this.setState({
          disabled: false
        });
        clearInterval(countdown);
      }
    }, 1000);
  };
  getVerCode = async () => {
    const { form } = this.props;
    let res;
    if (form.getFieldValue("phone")) {
      this.countDown();
      try {
        res = await http().getVerCode({
          telephone: form.getFieldValue("phone")
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      message.info("请先输入手机号获取验证码");
    }
  };
  onRegister = () => {
    this.props.history.push({
      pathname: "/register"
    });
  };
  render() {
    const { disabled, counts, showSpin } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="page">
        <div className="login-contain">
          <Spin spinning={showSpin}>
            <Form onSubmit={this.handleSubmit} className="login-form-userName">
              <h1>登录</h1>
              <Form.Item>
                {getFieldDecorator("phone", {
                  rules: [{ required: true, message: "请输入你的手机号!" }]
                })(
                  <Input
                    size="large"
                    prefix={
                      <Icon type="phone" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="手机号"
                  />
                )}
              </Form.Item>
              <Form.Item className="login-form-valid">
                {getFieldDecorator("valid", {
                  rules: [{ required: true, message: "请输入你的验证码!" }]
                })(
                  <Input
                    size="large"
                    className="login-form-valid-input"
                    prefix={
                      <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="验证码 "
                  />
                )}
              </Form.Item>
              {disabled ? (
                <Button
                  className="login-form-valid-countdown"
                  size="large"
                  type="primary"
                  disabled
                >
                  {counts}
                </Button>
              ) : (
                <Button
                  className="login-form-valid-button"
                  size="large"
                  type="primary"
                  onClick={this.getVerCode}
                >
                  获取验证码
                </Button>
              )}
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                onClick={this.login}
                size="large"
              >
                登录
              </Button>
              <div className="login-form-register">
                <a onClick={this.onRegister}>注册</a>
              </div>
            </Form>
          </Spin>
        </div>
      </div>
    );
  }
}

export default Form.create()(Login);
