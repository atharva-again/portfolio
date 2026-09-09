import CodingWithNothing from "./coding-with-nothing.mdx";
import CpcbAqiApi from "./cpcb-aqi-api.mdx";
import LessIsMore from "./less-is-really-more-more-so-in-the-ai-age.mdx";
import PlaywrightE2e from "./a-beginners-guide-to-e2e-testing-using-playwright.mdx";
import OssSoftware from "./a-list-of-oss-software-i-use.mdx";

export const contentMap = {
	"a-beginners-guide-to-e2e-testing-using-playwright": PlaywrightE2e,
	"less-is-really-more-more-so-in-the-ai-age": LessIsMore,
	"a-list-of-oss-software-i-use": OssSoftware,
	"cpcb-aqi-api": CpcbAqiApi,
	"coding-with-nothing": CodingWithNothing,
} as const;
