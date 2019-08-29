import React, { Component } from "react";
import "./ApplyDataBase.less";
import {
  Collapse,
  Icon,
  Input,
  Upload,
  Button,
  Form,
  Checkbox,
  List,
  Skeleton,
  Avatar
} from "antd";
import http from "../../../utils/api";

class ApplyDataBase extends Component {
  state = {
    imageUrl: "",
    applyList: [1, 2],
    showApply: false
  };
  componentDidMount = async () => {
    let res;
  };
  onApply = () => {
    this.setState({
      showApply: true
    });
  };
  onBack = () => {
    this.setState({
      showApply: false
    })
  }
  onChangeCheckbox = checkedValues => {
    console.log("checkedValues", checkedValues);
  };
  handleSubmit = () => {
    
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { imageUrl, applyList, showApply } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? "loading" : "plus"} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const options = [
      { label: "单中心研究", value: "单中心研究" },
      { label: "多中心研究", value: "多中心研究" },
      { label: "第三方研究", value: "第三方研究" },
      { label: "所有研究", value: "所有研究" }
    ];
    return (
      <div className="applyDataBase">
        <div className='applyDataBase-btns'>
        <Button icon={showApply?'rollback':'plus'} type="primary" onClick={showApply?this.onBack:this.onApply} className='applyDataBase-btn'>
         {showApply?"返回":"申请"} 
        </Button>
        <a  className='applyDataBase-photoBtn' type='link' >申请流程图</a>
        </div>
        <div className="applyDataBase-content">
          {showApply ? (
            <Form
              {...formItemLayout}
              onSubmit={this.handleSubmit}
              className="applyDataBase-form"
            >
              <h1>参与CHASE-IBD数据库建设申请表</h1>
              <h3>申请医疗单位</h3>
              <Form.Item label={<span>申请人&nbsp;</span>}>
                {getFieldDecorator("doctor", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your nickname!",
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label={<span>所属单位&nbsp;</span>}>
                {getFieldDecorator("hospital", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your nickname!",
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label={<span>职称&nbsp;</span>}>
                {getFieldDecorator("post", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your nickname!",
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label={<span>联系电话&nbsp;</span>}>
                {getFieldDecorator("phone", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your nickname!",
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label={<span>E-mail&nbsp;</span>}>
                {getFieldDecorator("email", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your nickname!",
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label={<span>IBD治疗团队名单&nbsp;</span>}>
                {getFieldDecorator("teamPeople", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your nickname!",
                      whitespace: true
                    }
                  ]
                })(
                  <React.Fragment>
                    <Input />
                    <Input />
                    <Input />
                  </React.Fragment>
                )}
              </Form.Item>
              <Form.Item label={<span>选择参与数据库研究&nbsp;</span>}>
                {getFieldDecorator("study", {
                  rules: []
                })(
                  <Checkbox.Group
                    options={options}
                    onChange={this.onChangeCheckbox}
                  />
                )}
              </Form.Item>
              <h3>贵院目前患者数量</h3>

              <Form.Item label={<span>CD患者数量：&nbsp;</span>}>
                {getFieldDecorator("CDNumber", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your nickname!",
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label={<span>UC患者数量：&nbsp;</span>}>
                {getFieldDecorator("UCNumber", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your nickname!",
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label={<span>医师执照：&nbsp;</span>}>
                {getFieldDecorator("doctorPhoto", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your nickname!",
                      whitespace: true
                    }
                  ]
                })(
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    onChange={this.handleChange}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="avatar"
                        style={{ width: "100%" }}
                      />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                )}
              </Form.Item>
              <Button className='applyDataBase-form-save'>保存</Button>
              <Button type='primary'  className='applyDataBase-form-submit'  htmlType="submit">>提交</Button>
              <Button icon='download' type='primary' className='applyDataBase-form-print'>打印</Button>
            </Form>
          ) : (
            <List
              className="applyDataBase-content-list"
              itemLayout="horizontal"
              dataSource={applyList}
              renderItem={item => (
                <List.Item actions={[<a key="list-loadmore-edit">查看</a>,<a key="list-loadmore-edit">提交</a>]}>
                  <Skeleton avatar title={false} loading={item} active>
                    <List.Item.Meta
                      avatar={
                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                      }
                      title={<a href="https://ant.design">{item}</a>}
                      description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                    />
                    <div>content</div>
                  </Skeleton>
                </List.Item>
              )}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Form.create()(ApplyDataBase);
