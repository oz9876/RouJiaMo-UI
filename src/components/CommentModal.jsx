import React, {Component} from 'react';
import {Modal, Form, Input, message } from 'antd';
const { TextArea } = Input;

const FormItem = Form.Item;

class CommentModal extends Component {

    modalClose() {
        const {handleClose, form} = this.props;
        form.resetFields();
        handleClose();
    }

    submit() {
        const {form, prop, handleClick, maxLength} = this.props;
        const fields = form.getFieldsValue();
        if(fields[prop] == undefined || fields[prop].length == 0){
            return message.warning('不能为空');
        }else if(fields[prop].length > maxLength){
            return message.warning(`不能超过${maxLength}`);
        }
        handleClick(fields[prop]);
        this.modalClose();
    }

    render() {
        const {open, prop, title, label, model} = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14}
        };

        return (
            <Modal maskClosable={false} title={title} visible={open} onCancel={() => this.modalClose()} onOk={() => this.submit()}>
                <Form layout="horizontal">
                    <FormItem {...formItemLayout} label={label}>
                        {getFieldDecorator(prop, {
                            initialValue: model[prop]
                        })(<TextArea rows={4}/>)}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(CommentModal);