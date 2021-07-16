// import { parse, parseDefaults } from '../src'
// import lexer from "../src/lexer"

let str = `<span data-content="Code" id="sb">abc</span><span class="wuwuwu" style="wuwuwu" >abc</span>`

const TOKEN = {
  TAG_START: "<",
  TAG_END: ">",
}

const TOKEN_TYPE = {
  TAG_START: 'tag_start',
  TAG_END: 'tag_end',
  TAG_NAME: 'tag_name',
}

const move = (state, step) => {
  state.cursor += step
}

const lexAttribute = (state) => {
  const { str, tokens } = state

  const tagEnd = str.indexOf(TOKEN.TAG_END, state.cursor)
  let attrEnd = str.indexOf(" ", state.cursor)

  if(attrEnd === -1 || attrEnd >= tagEnd) {
    attrEnd = tagEnd
  }

  if(state.cursor < attrEnd) {
    const attr =  str.slice(state.cursor, attrEnd)
    tokens.push({
      type: "attribute",
      content: attr
    })
    move(state, attr.length)
  }
}

const lexTag = (state) => {
  const { str, tokens } = state

  const tagEnd = str.indexOf(TOKEN.TAG_END, state.cursor)

  while(state.cursor < tagEnd) {
    if(str[state.cursor] === TOKEN.TAG_START) {
      const close = str[state.cursor + 1] === "/"
      tokens.push({
        type: TOKEN_TYPE.TAG_START,
        close
      })
      move(state, close ? 2 : 1)
      continue
    }


    // skip blanks
    if(str[state.cursor] === " ") {
      move(state, 1)
      continue
    }

    if(str[state.cursor - 1] === TOKEN.TAG_START || str[state.cursor - 2] === TOKEN.TAG_START) {
      let tagBreak
      const space = str.indexOf(" ", state.cursor)
      const tagEnd = str.indexOf(TOKEN.TAG_END, state.cursor)

      if(space < tagEnd && space !== -1) {
        tagBreak = space
      } else {
        tagBreak = tagEnd
      }

      const tagName = str.slice(state.cursor, tagBreak)
      tokens.push({
        type: "tag_name",
        content: tagName
      })
      move(state, tagName.length)
      continue
    }

    let attribute
    if((attribute = str.indexOf("=\"", state.cursor)) < tagEnd && attribute !== -1) {
      lexAttribute(state)
    }

  }

  // tagEnd
  tokens.push({
    type: TOKEN_TYPE.TAG_END,
  })
  move(state, 1)
}

const lexText = (state) => {
  const { tokens } = state
  const textBreak = str.indexOf(TOKEN.TAG_START, state.cursor)
  const text = str.slice(state.cursor, textBreak)

  tokens.push({
    type: "text",
    content: text
  })

  move(state, text.length)
}

const lexAll = (state) => {
  const { str, tokens } = state
  const endIndex = str.length

  while(state.cursor < endIndex) {
    if(str[state.cursor].startsWith(TOKEN.TAG_START)) {
      lexTag(state)
      continue
    }

    lexText(state)

  }

  return tokens
}

const lexer = (str) => {
  const state = { str, cursor: 0, tokens: [] }
  return lexAll(state)
}

const parser = () => {

}

const parse = () => {

}

// console.log(lexer(str, parseDefaults))
console.log(JSON.stringify(lexer(str), null, 4))