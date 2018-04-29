<?php

namespace AppBundle\Service;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Serializer\SerializerInterface;

class MosqueService
{

    /**
     * @var EntityManagerInterface
     */
    private $em;

    /**
     * @var SerializerInterface
     */
    private $serializer;

    public function __construct(EntityManagerInterface $em, SerializerInterface $serializer)
    {
        $this->em = $em;
        $this->serializer = $serializer;
    }

    public function getCalendarList()
    {
        $res = $this->em
            ->getRepository("AppBundle:Configuration")
            ->createQueryBuilder("c")
            ->select("c.id, m.zipcode, m.city, m.country")
            ->innerJoin("c.mosque", "m", "c.mosque_id = m.id")
            ->where("c.sourceCalcul = 'calendar'")
            ->andWhere("c.calendar IS NOT NULL")
            ->andWhere("m.city IS NOT NULL AND m.city != ''")
            ->groupBy("m.country, m.city")
            ->orderBy("m.country, m.zipcode", "ASC")
            ->getQuery()
            ->execute();

        $calendars = [];
        foreach ($res as $item) {
            $calendars[strtoupper($item["country"])][] = [
                'id' => $item["id"],
                'label' => substr($item["zipcode"], 0, 2) . ' ' . ucfirst($item["city"]) . ' ' . $item["zipcode"],
            ];
        }

        return $calendars;
    }

    public function getMosquesForApi($word)
    {
        if (strlen($word) > 1) {
            $mosques = $this->em->getRepository("AppBundle:Mosque")
                ->publicSearch($word)
                ->getQuery()
                ->getResult();

            return $this->serializer->serialize($mosques, 'json', ['groups' => ['api']]);
        }
        return [];
    }
}