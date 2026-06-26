import { Dispatcher, filters } from "@mtcute/dispatcher"
import { execSync } from "node:child_process"
import { bugs, homepage, name, repository } from "@/../package.json"
import { env } from "@/telegram/helpers/env"
import { evaluatorsFor } from "@/telegram/helpers/text"

function getGitInfo(): string {
    try {
        const branch = execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf8" }).trim()
        const commit = execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim()
        return `${branch}-${commit}`
    }
    catch {
        return "unknown"
    }
}

const gitInfo = process.env.GIT_INFO ?? getGitInfo()

export const infoDp = Dispatcher.child()

infoDp.onNewMessage(
    filters.or(filters.command("info"), filters.deeplink(["info"])),
    async (msg) => {
        const { t } = await evaluatorsFor(msg.chat)
        const infoText = t("info", { bugs, name, repository, homepage, branch: gitInfo })
        await msg.replyText(`${infoText}\n\n${env.ADDITIONAL_INFO}`)
    },
)