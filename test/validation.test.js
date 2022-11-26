import { expect } from "chai";
import axios from "axios";
import { JSDOM } from "jsdom";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { validation } from "public/js/validation.js";

const fetchData = async () => {
  const jar = new CookieJar();
  jar.setCookie(
    "appSession=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwiaWF0IjoxNjY3NjkxMTA5LCJ1YXQiOjE2Njc4NTg1NzQsImV4cCI6MTY2Nzk0NDk3NH0..R4k5zOf07QICYaGF.nRlBBKlzhTKmCVI-zRGXBWK5KDrcgK12RHVbeHKeFr3ny2JqgftkxLzaR7kctt6-eYX7CIjwmNF-OXd7UkEkUhjTeRpCq9ovOaeNPR-tEBKzgdwWbp0saNBAyPZznWjCpM6ePq_h8mc9CIbV1-xdaoFK_TKoDcyDWD0yY7relZUZhE8r-HDKtfUv_QUSFiA5Jq9QGBYiVA7jet2owFUkimZdZwnAp1KLPgX2m6-hqN02p7HJhnE_l5BQB1_9pfGGWM5O9B4vFwc1NslNJmVHz2GbjT-IwJsMFGhiQZnCEKn1Rb30dpECqnPAX6gervwhCjPVYtKauVLbnNmDiQKeHc2WiY2rNZpXne81H_Go_F8YQZjXTJOV1hv7_57eo4b3MarPq1rM5hhI01QZFjNm8ZfrITtz3S46FtBIejIwy0xiQyICgnI_8GqwmS-oGti8rOJofdQN_BJwkRHrhof4QOAImZ8v7jaXKCtd1e_VWcwsOUNHD6sSZuDrZov6BnexRWvMRpF8kiNV6BJQTCHH1LXHkxsSFCE3M9GS_xp12vOP_K6D3plf8xmLNw1L9QK3N8V2CLF0RQghkcoGbNKvQmPi0JCk8oICXGrysBDyGUprGlNtKL_AMrMcc8LIf-iWYx47YMe52edeFAawoZVD4LFtUjNYMoctVKiXdzj3kxMNMpstMwaBhPHaLQETx__g71swSJj8mo3UUYcbFKWkPuBBe8eajRqontYmVqsUSgIzuPMVrIM4K5ZIx9eieI1_xNQy0_8iXQ8vJ3-0CC0vLUBBoGK9XISmKlN-CTppmpK3L6mdNwXNLXaszPdDEmDh5CTg_HeC8sziZIzAfGxnfqoQGm0FJEBTyZu0CzUYZAPG4QPAMFeD2S9Noc6neVlsuvLlARBol9EkXp7oL9tfKahVOsdQiscSTNfxNre_6_jhIkPNT9PrnCRk4tLqoem7XdR09YlKDhfqL7Dd0Hdb1qgt6xOIsanCyjRwslKqwKfzGs1HDX3hGYzLVQBUORUKMW3awy7fKEK8Liy9yEgejCi3DzJiZtSnQbdlmbIJ6D6zdEbDTAtOC2hGt2YpHD0hiJDjSMIEH69PRXG0BPxEqYHfWUI2WACDJEyH7Yj_rKYou4RY5SAzqnO_k_L3GyBOWeIqFBOEzYFzybQKk3HXvaCNFpbFdgwM3GB64yrkMLLaKSD2EW7ZeINm5IoeKB2FRkGhz3SM9g18XUr0Kca8S0bbEghdNdyf_GrDgUPDycHh10HHt_VU3VmXKf4F-ggpe11lmFAICjgamC8UE9ebMoiUlMaLr1Q6sODZZPJau2u_yL1uLlrTuuq3hGmoVQcFFPBBbusFdtcKyFLQXXBVwNMQum_S-QsCj0IM-f6H9emKty--M-_ztSEKCB2go6YOa7SF7V1_kLv5YyCN36cRkjI-IQ5gXVlt4q12b2ynFWKEFlfcm75GxrYRInMbOzwgqXaDXHtQ1m9UUN6G87e3YO98ou8K4VKblwD6QItm04CUwsSGyVyVTOW--fNvQp9wVtLUozJxzj9bfc8Ox9GkIre2erH9K7hrFQJFfw.40QHGLgbkfhD4CHLRziS5A",
    "tasks.jmfcool.com"
  );
  const client = wrapper(axios.create({ jar, withCredentials: true }));
  return await client.get("https://tasks.jmfcool.com");
};

beforeEach(async () => {
  const { data } = await fetchData();
  const dom = new JSDOM(data);
  global.window = dom.window;
  global.document = dom.window.document;
});

describe("regex", () => {
  it("should be an object", () => {
    expect(validation.regex).to.be.a("object");
  });
  it("should be text", () => {
    const regex = validation.regex.empty.test("test");
    expect(regex).to.be.true;
  });
  it("should be an email", () => {
    const regex = validation.regex.email.test("test@test.com");
    expect(regex).to.be.true;
  });
});

describe("required", () => {
  it("should be a function", () => {
    expect(validation.required).to.be.a("function");
  });
});

describe("flag", () => {
  it("should be a function", () => {
    expect(validation.flag).to.be.a("function");
  });
  it("returns true for required", () => {
    const elements = document.getElementsByClassName("required");
    const flag = validation.flag(elements);
    expect(flag).to.be.true;
  });
  it("returns true for email", () => {
    const elements = document.getElementsByClassName("email");
    const flag = validation.flag(elements);
    expect(flag).to.be.true;
  });
});

describe("init", () => {
  it("should be a function", () => {
    expect(validation.init).to.be.a("function");
  });
});
