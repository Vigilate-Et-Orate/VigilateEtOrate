import * as rssParser from 'react-native-rss-parser'
import iconv from 'iconv-lite'
import axios from 'axios'
import { Buffer } from 'buffer'

import { TNominisSaint } from 'config/types/Nominis'
import * as Storage from 'utils/storage/StorageManager'
import URL from 'config/url.config.json'

export const getNominisSaint = async (): Promise<TNominisSaint | undefined> => {
  const resData = await axios({
    method: 'GET',
    url: URL.NOMINIS_RSS,
    responseType: 'arraybuffer'
  }).then((res) => {
    const decoded = iconv.decode(
      Buffer.from(res.data as ArrayBuffer),
      'iso-8859-1'
    )
    return decoded
  })
  const rss = await rssParser.parse(resData)
  if (!rss) return
  const rssSaint = rss.items[0]
  const saint: TNominisSaint = {
    saint: rssSaint.title.split(' - ')[0],
    url: rssSaint.links[0].url,
    description: rssSaint.description
  }
  await Storage.setDataAsync(Storage.Stored.DAY_INFO, saint)
  return saint
}
