import * as rssParser from 'react-native-rss-parser'
import { TNominisSaint } from 'config/types/Nominis'
import URL from 'config/url.config.json'

export const getNominisSaint = async (): Promise<TNominisSaint | undefined> => {
  const resData = await fetch(URL.NOMINIS_RSS).then((res) => res.text())
  const rss = await rssParser.parse(resData)
  if (!rss) return
  const rssSaint = rss.items[0]
  const saint: TNominisSaint = {
    saint: rssSaint.title,
    url: rssSaint.links[0].url,
    description: rssSaint.description
  }
  return saint
}
