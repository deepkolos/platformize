class $FontFaceSet {
  fontfaces: Record<string, FontFace>;

  constructor() {
    this.fontfaces = {};
  }

  getHashCode(font: FontFace) {
    return font.weight + " " + font.family;
  }

  add(font: FontFace) {
    this.fontfaces[this.getHashCode(font)] = font;
  }
  delete(font: FontFace) {
    delete this.fontfaces[this.getHashCode(font)];
  }
  check(): boolean {
    for (const key in this.fontfaces) {
      if (!this.fontfaces[key].loaded) return false;
    }
    return true;
  }

  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FontFaceSet/loading_event) */
  onloading: ((this: FontFaceSet, ev: Event) => any) | null;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FontFaceSet/loadingdone_event) */
  onloadingdone: ((this: FontFaceSet, ev: Event) => any) | null;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FontFaceSet/loadingerror_event) */
  onloadingerror: ((this: FontFaceSet, ev: Event) => any) | null;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FontFaceSet/ready) */
  readonly ready: Promise<FontFaceSet>;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FontFaceSet/status) */
  readonly status: FontFaceSetLoadStatus;
};

export { $FontFaceSet };
