''' Some day this will be deleted C: hopefully '''
import requests
from bs4 import BeautifulSoup

headers = requests.utils.default_headers()
headers.update({
	'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
})


def get_multiple_kills(doc, num):
    '''Function to get the multiple kills'''
    try:
        return int(doc[num+5].text)
    except:
        return  0

def scraper(player, server):
    '''
    Function that organizes the scraping of all the different champions
    '''
    champs = []
    opgg = "https://"+ server + '.op.gg/summoner/userName=' + player
    res_1 = requests.get(opgg, headers=headers).text
    document = BeautifulSoup(res_1, 'html.parser')

    champions = "https://"+ server + ".op.gg/summoner/champions/userName=" + player
    res_2 = requests.get(champions, headers=headers).text
    document2 = BeautifulSoup(res_2, 'html.parser')

    champs_more_data = document2.find_all('tr')[1:]

    champs = []

    # Fetch champions data
    champs_data = document.find_all('div', class_='champion-box')
    for index,champ_data in enumerate(champs_data):
        name_champ = champ_data.find('div', class_='face').findChild('img')['alt']
        image_champ = str(champ_data.find('img')['src'])
        games = int(champ_data.find('div', class_='played').findChildren('div')[-1].text.split(' ')[0])
        winrate = int(champ_data.find('div', class_='played').findChildren('div')[-2].text.split(' ')[0][:-1])
        try:
            kda = float(champ_data.find('div', class_='kda').findChildren('div')[0].findChildren('div')[-1].text.split(':')[0])
        except ValueError:
            kda = 100
        kills = float(champ_data.find('div', class_='detail').text.split('/')[0])
        deaths = float(champ_data.find('div', class_='detail').text.split('/')[1])
        assists = float(champ_data.find('div', class_='detail').text.split('/')[2])

        cs_total = float(champ_data.find('div', class_='cs').text.split(' ')[1])
        csmin = float(champ_data.find('div', class_='cs').text.split('(')[-1].split(')')[0])

        cells = champs_more_data[index].find_all('td', class_='value')

        gold = int(cells[1].text.replace(',',''))
        max_kills = int(cells[3].text)
        max_deaths = int(cells[4].text)
        avg_damage_dealt = int(cells[5].text.replace(',',''))
        avg_damage_taken = int(cells[6].text.replace(',',''))


        double_kills = get_multiple_kills(cells, 2)
        triple_kills = get_multiple_kills(cells, 3)
        quadra_kills = get_multiple_kills(cells, 4)
        penta_kills = get_multiple_kills(cells, 5)

        result = {
            'name': name_champ,
            'image': image_champ,
            'games': games,
            'winrate': winrate,
            'kda': kda,
            'kills': kills,
            'deaths': deaths,
            'assists': assists,
            'cs': cs_total,
            'csmin': csmin,
            'gold': gold,
            'max_kills': max_kills,
            'max_deaths': max_deaths,
            'avg_damage_dealt': avg_damage_dealt,
            'avg_damage_taken' : avg_damage_taken,
            'double_kills' :double_kills,
            'triple_kills' : triple_kills,
            'quadra_kills' : quadra_kills,
            'penta_kills' : penta_kills
        }

        champs.append(result)

    return champs
