import { TableData } from "./types";
export class Table {
  private parent: string;
  private data: TableData;

  constructor(parent: string) {
    if (typeof parent !== "string" || !parent) {
      throw "invalid parent";
    }
    this.parent = parent;
    this.data = {
      title: "",
      header: [],
      items: [],
    };
  }

  async load(url: string) {
    const res = await fetch(url);
    if (!res.ok) {
      throw "invalid response";
    }

    const { title, header, items } = (await res.json()) as TableData;
    if (!items.length) {
      throw "no items";
    }
    Object.assign(this.data, { title, header, items });

    this.render();
  }

  render() {
    // 부모, 데이터 체크
    const { title, header, items } = this.data;
    const parentEle = document.querySelector(this.parent);
    if (!parentEle) {
      throw "invalid parent element";
    }

    if (!items?.length) {
      parentEle.innerHTML = "no data";
      return;
    }

    parentEle.innerHTML = "";

    // table 생성
    const table = document.createElement("table");

    // title을 caption으로 설정
    const caption = document.createElement("caption");
    caption.innerHTML = title;
    table.appendChild(caption);

    // header를 thead로 설정
    table.appendChild(
      header.reduce((thead, data) => {
        const th = document.createElement("th");
        th.innerHTML = data;
        thead.appendChild(th);
        return thead;
      }, document.createElement("thead"))
    );

    // items를 tr로 변경
    items.forEach((item) => {
      table.appendChild(
        item.reduce((tr, data) => {
          const td = document.createElement("td");
          td.innerHTML = data;
          tr.appendChild(td);
          return tr;
        }, document.createElement("tr"))
      );
    });

    // table.append(
    //   ...items.map((item) =>
    //     item.reduce((tr, data) => {
    //       const td = document.createElement("td");
    //       td.innerText = data;
    //       tr.appendChild(td);
    //       return tr;
    //     }, document.createElement("tr"))
    //   )
    // );

    // parent에 table 추가
    parentEle.appendChild(table);
  }
}
