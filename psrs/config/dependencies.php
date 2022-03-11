<?php

use Doctrine\ORM\EntityManagerInterface;
use EDSC\Infra\EntityManagerCreator;

$builder = new DI\ContainerBuilder();
$builder->addDefinitions([
    EntityManagerInterface::class => function() {
        return (new EntityManagerCreator())->getEntityManager();
    }
]);

$container = $builder->build();

return $container;