# Description

PF Manager

BO -> MQ -> (MANAGER) <- [encoding.com|afrPF|zendcoder]

# Workflow

- Le backend envoi un ordre de transcode sur une video 
- Le client recoi l'ordre de transcode et crée un Content
- Ce content contient une liste de Broadcasters (orange,front,bbox)
  Chaques broadcaster contient une liste d' Encoding Profiles
  Les Profiles on plusieurs presets

- Les PF ecoutent l'ordre d'encodage et detectent le Brodcaster associé et deduit si oui ou non il est 
  capable de transcoder le profile
  si oui cela genere un|plusieurs Job(s) d'encodage.
  Une fois terminé les jobs retournent les assets streams pour les Broadcasters
