import React, { Component } from "react";
import "./Register.less";
import { Form, message, Icon, Input, Button, Checkbox, Spin } from "antd";
import http from "../../../utils/api";

class Register extends Component {
  state = {
    disabled: false,
    counts: 60,
    showSpin: false
  };

  componentDidMount = () => {};
  onLogin = () => {
    this.props.history.push({
      pathname: "/login"
    });
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
  register = async () => {
    http().clearCache();
    const { form } = this.props;
    let res;
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }
      let registerData = {
        Handphone: form.getFieldValue("phone"), // 手机号
        userid: form.getFieldValue("postNumber"), //执业证号码
        // occuptionNumber: form.getFieldValue("postNumber"), //执业证号码
        validcode: form.getFieldValue("valid"), // 验证码
        // hospital: form.getFieldValue("hospital"), // 医院
        nickname: form.getFieldValue("doctor"),
        // office:form.office,
        validresid: 616852937051
        // unionid: this.unionid,
        // openid: this.openid
      };
      let doctorData = {
        phoneNumber: form.getFieldValue("phone"), // 手机号
        occupationNumber: form.getFieldValue("postNumber"), //执业证号码
        hospital: form.getFieldValue("hospital"), // 医院
        doctor: form.getFieldValue("doctor"),
        email:form.getFieldValue("email"),
        post: form.getFieldValue("post") //职称
      };
      this.setState({
        showSpin: true
      });

      try {
        res = await http().register(registerData);
        if (res.data.error == 0) {
          message.success("注册成功");
          this.props.history.push({
            pathname: "/login",
            state: { doctorData }
          });
        } else {
          message.error(res.data.message);
        }
      } catch (error) {
        console.log("res", error);
        message.error(error.message);
      }
      this.setState({
        showSpin: false
      });
    });
  };
  render() {
    const { disabled, counts, showSpin } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="page">
        <div className="register-contain">
          <Spin spinning={showSpin}>
            <Form onSubmit={this.handleSubmit} className="login-form-userName">
              <h1>注册</h1>
              <Form.Item>
                {getFieldDecorator("doctor", {
                  rules: [{ required: true, message: "请输入您的姓名!" }]
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="姓名"
                  />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator("hospital", {
                  rules: [{ required: true, message: "请输入您所在的医院!" }]
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="医院"
                  />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator("post", {
                  rules: [{ required: true, message: "请输入您的职称!" }]
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="职称"
                  />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator("postNumber", {
                  rules: [{ required: true, message: "请输入您的执业证号码!" }]
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="执业证号码"
                  />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator("email", {
                  rules: [
                    {
                      type: "email",
                      required: true,
                      message: "请输入您的邮箱!"
                    }
                  ]
                })(
                  <Input
                    prefix={
                      <Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="邮箱"
                  />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator("phone", {
                  rules: [{ required: true, message: "请输入您的手机号!" }]
                })(
                  <Input
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
                    className="login-form-valid-input"
                    prefix={
                      <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="验证码 "
                  />
                )}
              </Form.Item>
              {disabled ? (
                <Button style={{ marginLeft: "10px" }} type="primary" disabled>
                  {counts}
                </Button>
              ) : (
                <Button
                  style={{ marginLeft: "10px" }}
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
                onClick={this.register}
                size="large"
              >
                注册
              </Button>
              <div className="login-form-register">
                <a onClick={this.onLogin}>登录</a>
              </div>
            </Form>
          </Spin>
        </div>
      </div>
    );
  }
}

export default Form.create()(Register);
