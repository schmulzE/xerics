import { Component } from "react";
import { Editor } from "react-draft-wysiwyg";
import { ContentState, EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

export default class TextEditor extends Component {
  state = {
    editorState: EditorState.createWithContent(ContentState.createFromBlockArray(
      htmlToDraft(this.props.content).contentBlocks,
    )),
  };
  
  componentDidMount() {
    this.setState({
      editorState:  EditorState.moveFocusToEnd(this.state.editorState), // EditorState imported from draft-js
    });
  }
  

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
    this.props.setContent(draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())));
  };

  render() {
    const { editorState } = this.state;


    function uploadImageCallBack(file) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest(); // eslint-disable-line no-undef
        xhr.open("POST", "https://api.imgur.com/3/image");
        xhr.setRequestHeader("Authorization", "Client-ID 8d26ccd12712fca");
        const data = new FormData(); // eslint-disable-line no-undef
        data.append("image", file);
        xhr.send(data);
        xhr.addEventListener("load", () => {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        });
        xhr.addEventListener("error", () => {
          const error = JSON.parse(xhr.responseText);
          reject(error);
        });
    });
  }
    return (
      <div>
        <Editor
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          placeholder="Write something!"
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            image: {
              urlEnabled: true,
              uploadEnabled: true,
              uploadCallback: uploadImageCallBack,
              previewImage: true,
              alt: { present: true, mandatory: true }
            }
          }}
        />
      </div>
    );
  }
}
